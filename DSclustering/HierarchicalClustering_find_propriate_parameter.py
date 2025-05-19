import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib as mpl

from scipy.cluster.hierarchy import linkage, dendrogram
from sklearn.cluster import AgglomerativeClustering
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score
from scipy.spatial.distance import pdist, squareform
from scipy.stats import mode

# 한글 폰트 설정
mpl.rc('font', family='Malgun Gothic')
mpl.rcParams['axes.unicode_minus'] = False

# 사용자 설정
SHOW_DENDROGRAM = True
SHOW_PCA = True
EVALUATE_K = [2, 3, 4, 5, 6]
LINKAGE_METHODS = ['ward', 'complete', 'average']
METRICS = ['euclidean', 'cosine']
CONSENSUS = False  # 앙상블(합의) 클러스터링 수행 여부
N_CLUSTERS = 4     # 최종 PCA 시각화에 사용할 클러스터 수

# 데이터 로드 및 전처리
df = pd.read_csv('github_profiles.csv')
user_ids = df['유저 ID'].astype(str).tolist()
X = df.drop(columns=['유저 ID']).values

# 덴드로그램 시각화 (첫 번째 조합)
if SHOW_DENDROGRAM:
    Z0 = linkage(X, method=LINKAGE_METHODS[0], metric=METRICS[0])
    plt.figure(figsize=(12, 6))
    dendrogram(Z0, labels=user_ids, leaf_rotation=90, leaf_font_size=6,
               color_threshold=0.7 * np.max(Z0[:, 2]))
    plt.title(f"Dendrogram ({LINKAGE_METHODS[0]}, {METRICS[0]})")
    plt.xlabel("유저 ID")
    plt.ylabel("거리")
    plt.axhline(0.7 * np.max(Z0[:, 2]), c='gray', ls='--', lw=0.8)
    plt.tight_layout()
    plt.show()

# 실루엣 및 던 지수 평가 함수
def dunn_index(X, labels):
    dist = squareform(pdist(X, metric='euclidean'))
    uniq = np.unique(labels)
    if len(uniq) < 2:
        return np.nan
    max_intra = max(
        dist[np.ix_(labels == c, labels == c)].max() if np.sum(labels == c) > 1 else 0
        for c in uniq
    )
    inters = []
    for i, ci in enumerate(uniq):
        for cj in uniq[i + 1:]:
            idx_i = np.where(labels == ci)[0]
            idx_j = np.where(labels == cj)[0]
            inters.append(dist[np.ix_(idx_i, idx_j)].min())
    min_inter = min(inters) if inters else 0
    return min_inter / max_intra if max_intra > 0 else np.nan

# 1) k 별 실루엣/던 평가 (ward, euclidean)
scores_k = {}
for k in EVALUATE_K:
    agg = AgglomerativeClustering(n_clusters=k, linkage='ward')
    lbl = agg.fit_predict(X)
    sil = silhouette_score(X, lbl, metric='euclidean') if len(np.unique(lbl)) > 1 else np.nan
    dun = dunn_index(X, lbl)
    scores_k[k] = (sil, dun)
print("=== k별 평가 (ward, euclidean) ===")
for k, (sil, dun) in scores_k.items():
    print(f"k={k}: Silhouette={sil:.4f}, Dunn={dun:.4f}")
print()

# 2) linkage·metric 조합 평가 (고정 k=N_CLUSTERS)
k0 = N_CLUSTERS
combo_scores = []
for link in LINKAGE_METHODS:
    for met in METRICS:
        if link == 'ward':
            agg = AgglomerativeClustering(n_clusters=k0, linkage=link)
            metric_used = 'euclidean'
        else:
            agg = AgglomerativeClustering(n_clusters=k0, linkage=link, metric=met)
            metric_used = met
        lbl = agg.fit_predict(X)
        sil = silhouette_score(X, lbl, metric=metric_used) if len(np.unique(lbl)) > 1 else np.nan
        dun = dunn_index(X, lbl)
        combo_scores.append((link, met, sil, dun, lbl))
print(f"=== linkage/metric 평가 (k={k0}) ===")
for link, met, sil, dun, _ in combo_scores:
    print(f"{link:8s}, {met:9s} -> Sil={sil:.4f}, Dunn={dun:.4f}")
print()

# 3) 앙상블 클러스터링 (다수결) - 비활성화 시 생략
if CONSENSUS:
    stack = np.vstack([lbl for *_, lbl in combo_scores]).T
    consensus_labels = mode(stack, axis=1).mode.flatten()
    print("=== 앙상블 클러스터링 평가 ===")
    if len(np.unique(consensus_labels)) > 1:
        sil_c = silhouette_score(X, consensus_labels, metric='euclidean')
        dun_c = dunn_index(X, consensus_labels)
        print(f"Consensus -> Silhouette={sil_c:.4f}, Dunn={dun_c:.4f}")
    else:
        print("앙상블 결과가 하나의 클러스터로 합의되어 평가 불가")
    final_labels = consensus_labels
else:
    final_labels = None

# 4) 최종 PCA 시각화: 앙상블이 아니면 N_CLUSTERS 기반 재군집화
if SHOW_PCA:
    if final_labels is None:
        link, met = LINKAGE_METHODS[0], METRICS[0]
        if link == 'ward':
            agg_final = AgglomerativeClustering(n_clusters=N_CLUSTERS, linkage=link)
        else:
            agg_final = AgglomerativeClustering(n_clusters=N_CLUSTERS, linkage=link, metric=met)
        final_labels = agg_final.fit_predict(X)
    pca = PCA(n_components=2, random_state=42)
    X2 = pca.fit_transform(X)
    plt.figure(figsize=(8, 6))
    sc = plt.scatter(X2[:, 0], X2[:, 1], c=final_labels, cmap='tab10', s=30, alpha=0.7)
    plt.legend(*sc.legend_elements(), title="Cluster", bbox_to_anchor=(1.05, 1), loc='upper left')
    title = '앙상블 PCA 투영' if CONSENSUS else f'PCA 투영 (k={N_CLUSTERS}, {LINKAGE_METHODS[0]}, {METRICS[0]})'
    plt.title(title)
    plt.tight_layout()
    plt.show()
