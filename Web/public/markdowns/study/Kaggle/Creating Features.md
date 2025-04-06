
# CREATING FEATURES

[원문](https://www.kaggle.com/code/ryanholbrook/creating-features)

## Introduction

어느 정도 가능성 있는 특성(feature)을 찾아냈다면, 이제 그것들을 발전시킬 차례이다.
Pandas로 할 수 있는 일반적인 여러 가지 변환 방법을 배워보자.
Pandas의 경우 Kaggle의 [Pandas 강의](https://www.kaggle.com/learn/pandas)를 참고하자.

이 강의에서는 다양한 특성 유형을 가진 네 가지 데이터셋을 사용한다.

- 미국 교통사고
- 1985년 자동차
- 콘크리트 배합
- 고객 생애 가치

이 데이터들을 불러오자.

```python 

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns

plt.style.use("seaborn-whitegrid")
plt.rc("figure", autolayout=True)
plt.rc(
    "axes",
    labelweight="bold",
    labelsize="large",
    titleweight="bold",
    titlesize=14,
    titlepad=10,
)

accidents = pd.read_csv("../input/fe-course-data/accidents.csv")
autos = pd.read_csv("../input/fe-course-data/autos.csv")
concrete = pd.read_csv("../input/fe-course-data/concrete.csv")
customer = pd.read_csv("../input/fe-course-data/customer.csv")

```

## Tips on Discovering New Features


> - 특성을 이해한다. 데이터셋의 **설명서**가 있다면 참고하자.
> - 문제 도메인에 대해 조사하여 도메인 지식을 습득한다. 예를 들어, 주택 가격을 예측하는 문제라면 부동산에 대해 조사한다. Wiki, 책, 논문 등을 찾아보자.
> - 과거 Kaggle 대회의 Solution 등을 적극적으로 참고하고 정리해보자.
> - **시각화**는 feature 분포의 문제점이나 복잡한 관계를 단순화할 수 있는 힌트를 준다. feature engineering 을 진행하면서 적극적으로 사용하자.

## Mathematical Transforms

수치형 특성 간의 관계는 수학 공식으로 표현되는 경우가 많고, 도메인 조사를 하다 보면 자주 마주치게 된다.
Pandas에서는 열(column)을 일반 숫자처럼 산술 연산에 사용할 수 있습니다.
자동차 데이터셋에는 차량 엔진에 관한 특성들이 있습니다. 
조사 결과, 유용할 수 있는 다양한 수식이 나오는데요, 예를 들어 `stroke ratio`는 엔진 효율성과 성능 간의 균형을 나타낸다.

```python
autos["stroke_ratio"] = autos.stroke / autos.bore
```

복잡한 조합일수록 모델이 학습하기 더 어려울 수 있다. 예를 들어, `displacement`는 엔진 출력의 척도인데, 다음과 같이 계산한다.

```python
autos["displacement"] = (
    np.pi * ((0.5 * autos.bore) ** 2) * autos.stroke * autos.num_of_cylinders
)
```

데이터 시각화는 종종 로그 또는 제곱과 같은 변환을 제안한다.
예를 들어, 미국 사고 데이터의 `WindSpeed`는 **매우 치우친 분포**를 가지고 있어서 로그 변환을 통해 **정규화**할 수 있다.

```python
accidents["LogWindSpeed"] = accidents.WindSpeed.apply(np.log1p)
```

로그1p는 값이 0일 경우를 대비해 `log(1+x)`를 계산합니다.  
(※ seaborn의 `shade=True`는 `fill=True`로 대체되어야 하며, 버전 0.14.0부터 오류가 됩니다.)

데이터 정리(Data Cleaning) 강의에서 정규화(normalization)와 Box-Cox 변환에 대해 더 배울 수 있습니다.

---

### **카운트 (Counts)**

무언가의 존재 여부를 나타내는 특성들은 종종 여러 개로 나뉘어 있습니다. 예를 들어 질병 위험 요소들의 집합처럼요. 이런 특성들은 카운트로 합쳐서 표현할 수 있습니다.

이 특성들은 일반적으로 이진형(1 또는 0) 혹은 불리언(True 또는 False)입니다. 파이썬에서는 불리언도 정수처럼 더할 수 있습니다.

미국 사고 데이터에는 사고 주변의 도로 시설 존재 여부를 나타내는 여러 특성이 있습니다. 이들을 더해서 주변에 존재하는 도로 시설의 개수를 계산할 수 있습니다:

```python
roadway_features = ["Amenity", "Bump", "Crossing", "GiveWay",
    "Junction", "NoExit", "Railway", "Roundabout", "Station", "Stop",
    "TrafficCalming", "TrafficSignal"]
accidents["RoadwayFeatures"] = accidents[roadway_features].sum(axis=1)
```

콘크리트 데이터셋에는 배합에 들어간 재료들의 양이 있습니다. 어떤 배합에는 특정 성분이 아예 없을 수도 있습니다 (값이 0). 아래는 각 배합에서 0이 아닌 재료의 개수를 세는 코드입니다:

```python
components = [ "Cement", "BlastFurnaceSlag", "FlyAsh", "Water",
               "Superplasticizer", "CoarseAggregate", "FineAggregate"]
concrete["Components"] = concrete[components].gt(0).sum(axis=1)
```

---

### **특성 쪼개기 및 결합 (Building-Up and Breaking-Down Features)**

복잡한 문자열을 더 단순한 조각들로 나눠서 유용한 특성을 만들 수 있습니다. 자주 볼 수 있는 예시:

- 주민등록번호: `123-45-6789`
- 전화번호: `(999) 555-0123`
- 주소: `8241 Kaggle Ln., Goose City, NV`
- 인터넷 주소: `http://www.kaggle.com`
- 제품 코드: `0 36000 29145 2`
- 날짜 및 시간: `Mon Sep 30 07:06:05 2013`

이런 문자열은 구조를 가지고 있어서 그 구조를 활용할 수 있습니다. 예를 들어 미국 전화번호의 지역 번호 `(999)`는 발신자의 위치를 알려줍니다. 이처럼 약간의 조사가 도움이 될 수 있습니다.

`str` 접근자를 사용하면 `split`과 같은 문자열 메서드를 열에 바로 적용할 수 있습니다. 아래는 보험 고객 데이터를 예로, Policy 열에서 보험 종류와 등급을 나누는 코드입니다:

```python
customer[["Type", "Level"]] = (
    customer["Policy"]
    .str
    .split(" ", expand=True)
)
```

반대로, 단순한 특성들을 결합해 하나의 조합 특성(composed feature)을 만들 수도 있습니다. 조합이 의미가 있다면 유용할 수 있습니다:

```python
autos["make_and_style"] = autos["make"] + "_" + autos["body_style"]
```

---

### **Kaggle Learn의 다른 강의에서 (Elsewhere on Kaggle Learn)**

아직 다루지 않은 데이터 종류들 중에서도 정보가 풍부한 것이 있습니다. 다행히도 Kaggle Learn에서 관련 강의를 제공합니다:

- 날짜 및 시간: [Data Cleaning 강의 - Parsing Dates](https://www.kaggle.com/learn/data-cleaning)
- 위도 및 경도: [Geospatial Analysis 강의](https://www.kaggle.com/learn/geospatial-analysis)

---

### **그룹 변환 (Group Transforms)**

마지막으로 그룹 변환은 범주형 열을 기준으로 여러 행의 정보를 집계하여 새로운 특성을 만드는 방식입니다. 예:
- “각 주(State)별 평균 소득”
- “장르별 평일 개봉 영화 비율”

이렇게 카테고리 간의 상호작용이 있다면 그룹 변환을 통해 유용한 특성을 만들 수 있습니다.

그룹 변환은 두 가지 열을 필요로 합니다:
- 그룹화할 범주형 열
- 집계할 수치형 열  
  그리고 하나의 집계 함수 (예: 평균 `mean`, 합계 `sum` 등)

예를 들어 “주(State)별 평균 소득”은 다음과 같이 작성할 수 있습니다:

```python
customer["AverageIncome"] = (
    customer.groupby("State")["Income"].transform("mean")
)
```

---  

물론이죠! 이어지는 남은 부분의 한글 번역을 아래에 제공합니다:

---

### **실전 예제 (Example - Encoding a Time Feature)**

콘크리트 데이터에는 시멘트가 타는 데 걸리는 시간을 나타내는 `Age`라는 특성이 있습니다. 하루에서 몇 달에 이르는 범위를 가지며, 콘크리트 강도에 큰 영향을 줄 수 있습니다. 다만, 이 특성은 선형적이지 않을 수도 있어 로그 변환을 통해 더 나은 효과를 낼 수 있습니다:

```python
concrete["LogAge"] = np.log(concrete["Age"])
```

시각화를 통해 로그 변환 전후의 관계를 비교해 보면 좋습니다. `LogAge`를 사용하면 모델이 더 쉽게 패턴을 학습할 수 있습니다.

---

### **실전 예제 (Example - Combining Features)**

자동차 데이터에서는 연료 소비량(`city_mpg`, `highway_mpg`)과 관련된 두 열이 있습니다. 각각 도심과 고속도로 주행 시 연비를 나타냅니다. 이 둘을 결합하여 종합적인 연비 특성을 만들 수 있습니다:

```python
autos["avg_mpg"] = (autos.city_mpg + autos.highway_mpg) / 2
```

이렇게 결합된 특성은 더 안정적이며, 두 특성의 개별 노이즈를 줄일 수 있습니다.

---

### **정리 (Recap)**

이번 수업에서는 다음과 같은 특성 엔지니어링 기법들을 배웠습니다:

- 수치형 열에 수학적 연산을 적용해 새로운 특성을 만들기
- 관련 있는 열들을 결합하거나, 쪼개거나, 조합하여 새 특성 만들기
- 이진형 열들을 더해서 '카운트' 특성을 생성하기
- 범주형 열을 기준으로 수치형 열을 집계하는 그룹 변환 적용하기

---

### **연습 문제 (Your Turn)**

이제 직접 연습해볼 시간입니다! [다음 연습 노트북](https://www.kaggle.com/code/alexisbcook/creating-features)에서 학습한 개념을 활용해 특성을 만들어보세요.

---

필요하시면 연습 노트북 내용도 번역해드릴 수 있어요!