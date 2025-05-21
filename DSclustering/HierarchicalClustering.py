import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib as mpl

from scipy.cluster.hierarchy import linkage, dendrogram
from sklearn.cluster import AgglomerativeClustering
from sklearn.decomposition import PCA

# 한글 폰트 설정 (Windows의 경우 'Malgun Gothic', macOS/Linux에서는 적절한 한글 폰트로 변경)
mpl.rc('font', family='Malgun Gothic')
# 음수 기호 표시를 위해 unicode minus 설정
mpl.rcParams['axes.unicode_minus'] = False

# 0) 시각화 선택: True/False로 토글
SHOW_DENDROGRAM = True    # 덴드로그램 출력 여부
SHOW_PCA = True           # PCA 투영 군집 시각화 출력 여부

# 1) 파라미터 설정
LINKAGE_METHOD = 'ward'         # ['ward', 'complete', 'average', 'single']
DISTANCE_METRIC = 'euclidean'   # ['euclidean', 'cosine', 'manhattan', ...]
N_CLUSTERS = 4                  # 최종 군집 개수

# 2) 데이터 로드 및 전처리
df = pd.read_csv('github_profiles.csv')
user_ids = df['유저 ID'].astype(str).tolist()
X = df.drop(columns=['유저 ID']).values

# 3) 덴드로그램 계산
Z = linkage(X, method=LINKAGE_METHOD, metric=DISTANCE_METRIC)

# 4) 덴드로그램 시각화
if SHOW_DENDROGRAM:
    plt.figure(figsize=(12, 6))
    dendrogram(
        Z,
        labels=user_ids,
        leaf_rotation=90,
        leaf_font_size=6,
        color_threshold=0.7 * np.max(Z[:, 2])
    )
    plt.title("GitHub Users 기술 스택 덴드로그램")
    plt.xlabel("유저 ID")
    plt.ylabel("군집 간 거리")
    plt.axhline(y=0.7 * np.max(Z[:, 2]), c='gray', ls='--', lw=0.8)
    plt.tight_layout()
    plt.show()

# 5) AgglomerativeClustering 으로 레이블 획득
agg_params = {'n_clusters': N_CLUSTERS, 'linkage': LINKAGE_METHOD}
if LINKAGE_METHOD != 'ward':
    agg_params['metric'] = DISTANCE_METRIC
agg = AgglomerativeClustering(**agg_params)
labels = agg.fit_predict(X)
df['hier_cluster'] = labels

# 6) 결과 분석
print("=== 각 군집별 유저 수 ===")
print(df['hier_cluster'].value_counts(), "\n")
print("=== 각 군집별 평균 언어 비율 ===")
print(df.groupby('hier_cluster').mean(numeric_only=True), "\n")

# 7) PCA 투영 후 군집 시각화
if SHOW_PCA:
    pca = PCA(n_components=2, random_state=42)
    X_pca = pca.fit_transform(X)

    plt.figure(figsize=(8, 6))
    scatter = plt.scatter(
        X_pca[:, 0], X_pca[:, 1],
        c=labels, cmap='tab10', s=30, alpha=0.7
    )
    plt.legend(
        *scatter.legend_elements(), title="Cluster",
        bbox_to_anchor=(1.05, 1), loc='upper left'
    )
    plt.title("Hierarchical Clustering 결과 (PCA 2D 투영)")
    plt.xlabel("PCA Component 1")
    plt.ylabel("PCA Component 2")
    plt.tight_layout()
    plt.show()
