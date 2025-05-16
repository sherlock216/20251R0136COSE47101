# Tech Pattern Mining Project

This project aims to conduct technology pattern mining by year using the GitHub API to crawl technology information such as frameworks, languages, and technologies (e.g., CNN, transformer) from clustered stacks. The project analyzes frequent patterns, association rules, and time series patterns using dummy data for model testing.

## Project Structure

```
tech-pattern-mining
├── src
│   ├── api
│   │   ├── __init__.py
│   │   └── github_client.py
│   ├── data
│   │   ├── __init__.py
│   │   ├── crawler.py
│   │   └── preprocessor.py
│   ├── models
│   │   ├── __init__.py
│   │   ├── association_rules.py
│   │   ├── frequent_patterns.py
│   │   └── time_series_analysis.py
│   ├── utils
│   │   ├── __init__.py
│   │   └── helpers.py
│   ├── visualizations
│   │   ├── __init__.py
│   │   └── plots.py
│   ├── config.py
│   └── main.py
├── tests
│   ├── __init__.py
│   ├── test_crawler.py
│   ├── test_models.py
│   └── dummy_data.py
├── notebooks
│   ├── exploratory_analysis.ipynb
│   └── pattern_visualization.ipynb
├── requirements.txt
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/tech-pattern-mining.git
   ```
2. Navigate to the project directory:
   ```
   cd tech-pattern-mining
   ```
3. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

## Usage

1. Configure the API settings in `src/config.py`.
2. Run the main application:
   ```
   python src/main.py
   ```
3. Explore the Jupyter notebooks in the `notebooks` directory for exploratory analysis and visualization of patterns.

## Features

- **Data Crawling**: Utilizes the GitHub API to gather technology-related data.
- **Data Preprocessing**: Cleans and prepares the crawled data for analysis.
- **Pattern Mining**: Implements algorithms for frequent pattern mining and association rule mining.
- **Time Series Analysis**: Analyzes trends and forecasts patterns in technology data.
- **Visualization**: Provides visual representations of the analysis results.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.