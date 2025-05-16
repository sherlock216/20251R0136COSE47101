import pandas as pd
import numpy as np
from sklearn.cluster import DBSCAN
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score
from scipy.spatial.distance import pdist
import matplotlib.pyplot as plt


# Dunn Index 계산 함수
def dunn_index(data, labels):
    unique_labels = np.unique(labels)
    unique_labels = unique_labels[unique_labels != -1]  # Noise 제외
    if len(unique_labels) < 2:
        return 0  # 클러스터가 2개 미만이면 Dunn Index 계산 불가

    # 클러스터 간 거리 계산
    inter_cluster_distances = []
    for i in unique_labels:
        for j in unique_labels:
            if i != j:
                cluster_i = data[labels == i]
                cluster_j = data[labels == j]
                inter_cluster_distances.append(np.min(pdist(np.vstack([cluster_i, cluster_j]))))

    # 클러스터 내 거리 계산
    intra_cluster_distances = []
    for i in unique_labels:
        cluster_i = data[labels == i]
        intra_cluster_distances.append(np.max(pdist(cluster_i)))

    return np.min(inter_cluster_distances) / np.max(intra_cluster_distances)


# DBSCAN 클러스터링 함수
def perform_dbscan_clustering(file_path, output_path, eps=0.5, min_samples=5):
    # CSV 파일 로드
    df = pd.read_csv(file_path)
    data = df.values  # 데이터 배열로 변환

    # DBSCAN 실행
    dbscan = DBSCAN(eps=eps, min_samples=min_samples)
    labels = dbscan.fit_predict(data)

    # 클러스터링 평가
    silhouette = silhouette_score(data, labels) if len(set(labels)) > 1 else -1
    dunn = dunn_index(data, labels)

    # 클러스터링 결과를 데이터프레임에 추가
    df['Cluster_Label'] = labels

    # 결과 저장
    df.to_csv(output_path, index=False)

    return labels, silhouette, dunn

# 시각화 함수
def visualize_clusters(data, labels):
    # PCA로 차원 축소
    pca = PCA(n_components=2)
    reduced_data = pca.fit_transform(data)

    # 시각화
    plt.figure(figsize=(10, 7))
    unique_labels = np.unique(labels)
    for label in unique_labels:
        if label == -1:  # Noise
            color = 'k'
            label_name = 'Noise'
        else:
            color = plt.cm.get_cmap('tab10')(label / (max(unique_labels) if max(unique_labels) > 0 else 1))
            label_name = f'Cluster {label}'
        plt.scatter(reduced_data[labels == label, 0], reduced_data[labels == label, 1],
                    label=label_name, alpha=0.6, c=[color])

    plt.title("DBSCAN Clustering Visualization")
    plt.xlabel("PCA Component 1")
    plt.ylabel("PCA Component 2")
    plt.legend()
    plt.show()


# 사용 예시
if __name__ == "__main__":
    # CSV 파일 경로
    file_path = "user_code_usage.csv"  # 파일 경로를 적절히 수정하세요
    output_path = "clustered_output.csv"  # 결과를 저장할 파일 경로

    # DBSCAN 실행 및 평가
    labels, silhouette, dunn = perform_dbscan_clustering(file_path, output_path, eps=0.7, min_samples=10)

    print("클러스터링 결과 레이블:", labels)
    print("Silhouette Coefficient:", silhouette)
    print("Dunn Index:", dunn)