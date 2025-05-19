import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib as mpl

from scipy.cluster.hierarchy import linkage, dendrogram
from sklearn.cluster import AgglomerativeClustering
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score
from scipy.spatial.distance import pdist, squareform

# 한글 폰트 설정
mpl.rc('font', family='Malgun Gothic')
mpl.rcParams['axes.unicode_minus'] = False

# 사용자 설정
SHOW_DENDROGRAM = True   # 덴드로그램 출력 여부
SHOW_PCA = True          # PCA 출력 여부
N_CLUSTERS = 4           # 고정 클러스터 개수
LINKAGE_METHOD = 'average'
METRIC = 'euclidean'

# 데이터 로드 및 전처리
df = pd.read_csv('github_profiles.csv')
user_ids = df['유저 ID'].astype(str).tolist()
X = df.drop(columns=['유저 ID']).values

# 덴드로그램 (전체 트리, 4개 클러스터 색상)
if SHOW_DENDROGRAM:
    Z = linkage(X, method=LINKAGE_METHOD, metric=METRIC)
    # 클러스터 수에 따른 컷트라인 계산
    threshold = Z[-(N_CLUSTERS - 1), 2]
    plt.figure(figsize=(12, 6))
    dendrogram(
        Z,
        labels=user_ids,
        leaf_rotation=90,
        leaf_font_size=6,
        color_threshold=threshold
    )
    plt.title(f"Dendrogram ({LINKAGE_METHOD}, {METRIC}) - Colored by {N_CLUSTERS} clusters")
    plt.xlabel("유저 ID")
    plt.ylabel("거리")
    # 컷트라인 시각화
    plt.axhline(y=threshold, c='red', ls='--', lw=1)
    plt.tight_layout()
    plt.show()

# 던 지수 계산 함수
def dunn_index(X, labels):
    dist = squareform(pdist(X, metric=METRIC))
    uniq = np.unique(labels)
    if len(uniq) < 2:
        return np.nan
    max_intra = max(
        dist[np.ix_(labels == c, labels == c)].max()
        for c in uniq if np.sum(labels == c) > 1
    )
    inters = []
    for i, ci in enumerate(uniq):
        for cj in uniq[i + 1:]:
            idx_i = np.where(labels == ci)[0]
            idx_j = np.where(labels == cj)[0]
            inters.append(dist[np.ix_(idx_i, idx_j)].min())
    min_inter = min(inters)
    return min_inter / max_intra if max_intra > 0 else np.nan

# 클러스터링 및 평가
agg = AgglomerativeClustering(n_clusters=N_CLUSTERS, linkage=LINKAGE_METHOD, metric=METRIC)
labels = agg.fit_predict(X)
df['cluster'] = labels

sil_score = silhouette_score(X, labels, metric=METRIC)
dunn_score = dunn_index(X, labels)
print(f"Silhouette Score (k={N_CLUSTERS}, {LINKAGE_METHOD}, {METRIC}): {sil_score:.4f}")
print(f"Dunn Index    (k={N_CLUSTERS}, {LINKAGE_METHOD}, {METRIC}): {dunn_score:.4f}\n")

# PCA 투영 및 시각화
if SHOW_PCA:
    pca = PCA(n_components=2, random_state=42)
    X2 = pca.fit_transform(X)
    plt.figure(figsize=(8, 6))
    scatter = plt.scatter(
        X2[:, 0], X2[:, 1], c=labels, cmap='tab10', s=30, alpha=0.7
    )
    plt.legend(*scatter.legend_elements(), title="Cluster", bbox_to_anchor=(1.05, 1), loc='upper left')
    plt.title(f"PCA Projection (k={N_CLUSTERS}, {LINKAGE_METHOD}, {METRIC})")
    plt.xlabel("PC1")
    plt.ylabel("PC2")
    plt.tight_layout()
    plt.show()
