
# MUTUAL INFORMATION

[원문](https://www.kaggle.com/code/ryanholbrook/mutual-information)

## Introduction

새로운 데이터셋을 처음 접할 때, 수백 또는 수천 개의 특성이 주어질 수 있으며, 그에 대한 설명조차 없을 수도 있다. 이럴 때, 어디서부터 시작해야 할까?

좋은 첫 단계는 **특성 유용성 지표(feature utility metric)** 를 사용하여 특성을 순위화하는 것이다. 
이는 특성과 목표 변수(target) 간의 관계를 측정하는 함수이다. 
이렇게 하면 가장 유용한 특성을 먼저 선택하여 개발을 시작할 수 있고, 시간 낭비를 줄일 수 있다.

이때 사용할 지표는 **상호 정보량(Mutual Information, MI)** 이다. 상호 정보량은 **상관관계(correlation)** 와 유사하게 두 변수 간의 관계를 측정하는데, 
상관관계는 `선형적인 관계`만 감지할 수 있는 반면, 상호 정보량은 `모든 형태의 관계`를 감지할 수 있다.

상호 정보량은 다음과 같은 이유로 초기 특성 개발 단계에서 유용하다. 

- 사용 및 해석이 쉽다.
- 계산이 효율적이다.
- 이론적으로 타당한 근거를 가진다.
- 과적합(overfitting)에 강하다.
- 선형 뿐만 아니라 모든 형태의 관계를 감지할 수 있다.

## 상호 정보량(MI)과 그것이 측정하는 것

상호 정보량은 **불확실성을 감소시키는 정도**를 측정한다. 즉, 특정 특성(feature)의 값을 알았을 때, 목표 변수(target)에 대한 불확실성이 얼마나 감소하는지를 나타낸다.

예를 들어, Ames Housing Data에서 `ExterQual(건물 외관 품질)`과 `SalePrice(판매 가격)` 간의 관계를 살펴보자.

![image](https://storage.googleapis.com/kaggle-media/learn/images/X12ARUK.png)

- `ExterQual`이 `Fair, Typical, Good, Excellent` 네 가지 범주를 가질 때, 각 범주별로 `SalePrice` 값이 특정 범위 안에 집중되는 경향이 있다.
- 즉, `ExterQual` 값을 알면 `SalePrice` 값을 예측하는 데 더 확신을 가질 수 있다.
- `ExterQual`이 `SalePrice`에 대해 가지는 **상호 정보량(MI)** 은 이러한 불확실성 감소의 평균값이다.
- 예를 들어, `Fair`의 빈도가 낮다면, MI 점수에서 상대적으로 낮은 가중치를 받는다.

> **Technical Note**
> 
> 불확실성을 측정하는 데에는 정보 이론의 개념 중 하나인 **엔트로피(Entropy)** 가 사용된다.
> - 엔트로피는 **평균적으로 어떤 변수를 설명하기 위해 몇 개의 예/아니오(yes-or-no) 질문이 필요한지**를 나타낸다.
> - 상호 정보량은 **특성이 목표 변수에 대해 대답해 줄 수 있는 질문의 개수**를 의미한다.  이게 무슨말일까?


## 상호 정보량(MI) 점수 해석

- MI 점수의 최소값은 **0.0**이며, 이는 두 변수가 완전히 독립적임을 의미한다. 즉, 한 변수로부터 다른 변수에 대한 정보를 전혀 얻을 수 없음을 나타낸다.
- 이론적으로 MI에는 상한이 없지만, **2.0**을 넘는 경우는 드물다.
- MI는 log-scale이므로 증가 속도가 느리다.

> **MI 점수 해석 시 유의할 점**
> 1. MI는 개별 특성이 목표 변수를 얼마나 잘 예측할 수 있는지를 나타낸다.
> 2. 그러나 어떤 특성은 다른 특성과 함께 사용될 때 더 유용할 수도 있다. MI는 개별 특성만 평가하므로, **특성 간의 상호작용(interaction effects)** 을 고려하지 않는다.
> 3. 특정 특성이 높은 MI 점수를 가지더라도, **모델이 그 정보를 제대로 학습할 수 있을지는 별개의 문제**이다. 모델이 특성의 패턴을 학습할 수 있도록 적절한 변환이 필요할 수도 있다.


## 예제 - 1985년 자동차 데이터셋

이 예제에서는 [1985년 자동차 데이터셋](https://www.kaggle.com/datasets/toramky/automobile-dataset)를 사용하여, **자동차의 가격(price)을 예측하는 데 가장 중요한 특성**을 찾는다.

#### **데이터 예시 (일부 컬럼)**

| symboling | make | fuel_type | aspiration | num_of_doors | body_style | drive_wheels | engine_location | wheel_base | length | ... | engine_size | fuel_system | bore | stroke | compression_ratio | horsepower | peak_rpm | city_mpg | highway_mpg | price  |
|-----------|------|-----------|------------|--------------|------------|--------------|----------------|------------|--------|-----|-------------|-------------|------|--------|-----------------|------------|----------|----------|------------|--------|
| 3         | alfa-romero | gas | std | 2 | convertible | rwd | front | 88.6 | 168.8 | ... | 130 | mpfi | 3.47 | 2.68 | 9 | 111 | 5000 | 21 | 27 | 13495  |
| 3         | alfa-romero | gas | std | 2 | convertible | rwd | front | 88.6 | 168.8 | ... | 130 | mpfi | 3.47 | 2.68 | 9 | 111 | 5000 | 21 | 27 | 16500  |
| 1         | alfa-romero | gas | std | 2 | hatchback | rwd | front | 94.5 | 171.2 | ... | 152 | mpfi | 2.68 | 3.47 | 9 | 154 | 5000 | 19 | 26 | 16500  |

#### **1. 범주형 변수(Label Encoding) 변환**
Scikit-learn의 `mutual_info_regression` 함수는 연속형 변수(continuous)와 범주형 변수(categorical)를 다르게 처리한다. 
따라서 범주형 변수는 **라벨 인코딩(label encoding)** 을 수행해야 한다.

```python
X = df.copy()
y = X.pop("price")

# 범주형 변수(Label Encoding)
for colname in X.select_dtypes("object"):
    X[colname], _ = X[colname].factorize()

# 모든 범주형 변수가 정수형(int)인지 확인
discrete_features = X.dtypes == int
```

#### **2. MI 점수 계산 및 시각화**

```python
from sklearn.feature_selection import mutual_info_regression

def make_mi_scores(X, y, discrete_features):
    mi_scores = mutual_info_regression(X, y, discrete_features=discrete_features)
    mi_scores = pd.Series(mi_scores, name="MI Scores", index=X.columns)
    mi_scores = mi_scores.sort_values(ascending=False)
    return mi_scores

mi_scores = make_mi_scores(X, y, discrete_features)

# 일부 특성의 MI 점수 출력
mi_scores[::3]
```

***출력 예시 (MI 점수 상위 특성)**

```text
    curb_weight          1.540126
    highway_mpg          0.951700
    length               0.621566
    fuel_system          0.485085
    stroke               0.389321
    num_of_cylinders     0.330988
    compression_ratio    0.133927
    fuel_type            0.048139
    Name: MI Scores, dtype: float64
```


이 데이터를 바 그래프로 시각화하면 MI 점수가 높은 특성을 쉽게 비교할 수 있다.

```python

def plot_mi_scores(scores):
    scores = scores.sort_values(ascending=True)
    width = np.arange(len(scores))
    ticks = list(scores.index)
    plt.barh(width, scores)
    plt.yticks(width, ticks)
    plt.title("Mutual Information Scores")
    
plt.figure(dpi=100, figsize=(8, 5))
plot_mi_scores(mi_scores)
```
![g](https://www.kaggleusercontent.com/kf/126574300/eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..gJ6J3OVcO45oGFg1Pu51JA.twT2mTogoL3FRdyppUCCTaSfDIya6FFboWxgsZFCMh_SzNIxcFuv1_GOFDm0v22JMuEPESAW4SOQMpswyrWXUiJdWxt1nBnENyt2-jpxb7wLh3_OwCNRFTfBzlFbhvpvJLa_Acnb-M7ckYfJx6xADd52CyuX6koagRzlGGB8pTcWqGb3CC6n0GPuoDbshZhH9-zokA-lX-Psu9WDLlGSH4_eP7IXuGXvcnCdzxklbXNjOppZrfQzWex5ToYPQNohjOkmlszCzyTdcbehgIkEbQ15QaB-71dVl8nC-OT-AbYmbXwVZ0I4NnIUII2AoarzLZJX0yHOl06xJ5gnkte8ldh4vnTuS3xDfCBdSa3B0IPg0nbZUBoBfbtAmpJ6K4ACyaiQJzlbAirGm81PLpI0NLsp0VtZXkUGhHMAw9EeWe0xTN76tgd3ke74iHBrjZGLAmeceRMdIQxFF-n-uGpRcbkOlvcFcqmZQoyAMeV96ffmZqdlitBsZ8wZjHR65_f9V--73I1q8UZYK-H3KtSTfhomP7z0BVefhFe6mA01_JvrPkQIM4SKWZ4US-vlXRQK4ytvfX_PJI9BMYcd__R-OxreiPVEv6porkYPUNNCURt77ODst0UpwxTVZQpGRI-elGV_HNfOCWcEBdohci8O0g.0mXePOjWF0S8eiLF5kkQaw/__results___files/__results___7_0.png)

이러한 **데이터 시각화**는 유틸리티 랭킹을 수행한 후에 진행하기 좋은 단계이다.

이제 몇 가지 예제를 더 자세히 살펴보자.

예상할 수 있듯, 높은 점수를 받은 `curb_weight` 특징은 target 변수인 `price`와 강한 관계를 보이고 있다.

```python
sns.relplot(x="curb_weight", y="price", data=df);
```

![image](https://www.kaggleusercontent.com/kf/126574300/eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..gJ6J3OVcO45oGFg1Pu51JA.twT2mTogoL3FRdyppUCCTaSfDIya6FFboWxgsZFCMh_SzNIxcFuv1_GOFDm0v22JMuEPESAW4SOQMpswyrWXUiJdWxt1nBnENyt2-jpxb7wLh3_OwCNRFTfBzlFbhvpvJLa_Acnb-M7ckYfJx6xADd52CyuX6koagRzlGGB8pTcWqGb3CC6n0GPuoDbshZhH9-zokA-lX-Psu9WDLlGSH4_eP7IXuGXvcnCdzxklbXNjOppZrfQzWex5ToYPQNohjOkmlszCzyTdcbehgIkEbQ15QaB-71dVl8nC-OT-AbYmbXwVZ0I4NnIUII2AoarzLZJX0yHOl06xJ5gnkte8ldh4vnTuS3xDfCBdSa3B0IPg0nbZUBoBfbtAmpJ6K4ACyaiQJzlbAirGm81PLpI0NLsp0VtZXkUGhHMAw9EeWe0xTN76tgd3ke74iHBrjZGLAmeceRMdIQxFF-n-uGpRcbkOlvcFcqmZQoyAMeV96ffmZqdlitBsZ8wZjHR65_f9V--73I1q8UZYK-H3KtSTfhomP7z0BVefhFe6mA01_JvrPkQIM4SKWZ4US-vlXRQK4ytvfX_PJI9BMYcd__R-OxreiPVEv6porkYPUNNCURt77ODst0UpwxTVZQpGRI-elGV_HNfOCWcEBdohci8O0g.0mXePOjWF0S8eiLF5kkQaw/__results___files/__results___9_0.png)

한편, `fuel_type` 특징은 MI 점수가 비교적 낮지만, 여기 lmplot 을 활용하여 산점도와 회귀 직선을 같이 그린 그래프를 살펴보자.
그래프에서 볼 수 있듯이 `horsepower` 특징에서 `fuel_type`특징이 서로 다른 `price` 집단을 분리하는 역할로 작용함을 알 수 있다.

```python
sns.lmplot(x="horsepower", y="price", hue="fuel_type", data=df);
```

![image](https://www.kaggleusercontent.com/kf/126574300/eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..gJ6J3OVcO45oGFg1Pu51JA.twT2mTogoL3FRdyppUCCTaSfDIya6FFboWxgsZFCMh_SzNIxcFuv1_GOFDm0v22JMuEPESAW4SOQMpswyrWXUiJdWxt1nBnENyt2-jpxb7wLh3_OwCNRFTfBzlFbhvpvJLa_Acnb-M7ckYfJx6xADd52CyuX6koagRzlGGB8pTcWqGb3CC6n0GPuoDbshZhH9-zokA-lX-Psu9WDLlGSH4_eP7IXuGXvcnCdzxklbXNjOppZrfQzWex5ToYPQNohjOkmlszCzyTdcbehgIkEbQ15QaB-71dVl8nC-OT-AbYmbXwVZ0I4NnIUII2AoarzLZJX0yHOl06xJ5gnkte8ldh4vnTuS3xDfCBdSa3B0IPg0nbZUBoBfbtAmpJ6K4ACyaiQJzlbAirGm81PLpI0NLsp0VtZXkUGhHMAw9EeWe0xTN76tgd3ke74iHBrjZGLAmeceRMdIQxFF-n-uGpRcbkOlvcFcqmZQoyAMeV96ffmZqdlitBsZ8wZjHR65_f9V--73I1q8UZYK-H3KtSTfhomP7z0BVefhFe6mA01_JvrPkQIM4SKWZ4US-vlXRQK4ytvfX_PJI9BMYcd__R-OxreiPVEv6porkYPUNNCURt77ODst0UpwxTVZQpGRI-elGV_HNfOCWcEBdohci8O0g.0mXePOjWF0S8eiLF5kkQaw/__results___files/__results___11_0.png)

이는 `fuel_type`이 상호작용 효과를 유발할 수 있으며, 단순히 **MI 점수만 보고 중요하지 않다고 판단**해서는 안 된다는 것을 의미한다. 
MI 점수가 낮다고 해서 곧바로 해당 특징을 제거하기보다는, 그 feature가 만들어낼 수 있는 상호작용 효과를 탐색해보는 것이 중요하다.
이를 분석해보는 과정에서 도메인 지식이 많은 도움이 될 수 있다.

데이터 시각화를 잘 사용하면 이러한 데이터 내의 중요한 관계를 발견하는 데 도움이 될 수 있으므로, 잘 활용해보자.

이제 배운 내용을 바탕으로 kaggle에서 [직접 데이터셋의 특징을 랭킹해보자.](https://www.kaggle.com/code/pysunn/exercise-mutual-information/edit)





