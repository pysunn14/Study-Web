
# FEATURE ENGINEERING

[원문](https://www.kaggle.com/learn/feature-engineering)

이 장에서 다음의 방법들을 배우게 된다.

> - 상호 정보(mutual information)를 사용해 가장 중요한 특성을 판단하는 방법
> 
> - 여러 실제 문제 도메인에서 새로운 특성을 만들어내는 방법
>   
> - 고유값이 많은 범주형 데이터를 타겟 인코딩(target encoding)으로 인코딩하는 방법
> 
> - K-평균 클러스터링(K-means clustering)으로 세분화된 특성 만들기
> 
> - 주성분 분석(PCA)으로 데이터의 변동을 분해하여 특성 만들기

## Feature Engineering의 목표

Feature Engineering의 목표는 데이터를 현재 문제에 더 적합하게 만드는 것이다.

예시로, "체감 온도(apparent temperature)"를 생각해보자. 실제로 측정된 기온, 습도, 바람 속도와 같은 데이터들을 
바탕으로 사람이 느끼는 온도를 계산한 셈이다.
즉, 관측된 데이터를 우리가 실제로 관심 있는 정보에 맞게 변형한 것으로, 이것이 feature engineering이다.

이를 통해 다음과 같은 효용을 얻을 수 있다.
- 모델 예측 성능 향상
- 계산량 또는 데이터 요구량 감소
- 결과의 해석 용이성 향상

## 핵심 원칙

어떤 feature가 유용하다는 것은, **목표값 (target)** 과 모델이 학습할 수 있는 **관계**가 있어야 한다.
예를 들어서 선형 모델은 당연히 선형적인 관계를 학습할 수 있다. 그렇다면 우리가 선형 모델을 쓸 때는, feature <-> target의 관계를 linear하게 변형주어야 한다는 것이다.


이 말은 곧, 특성에 적용한 어떠한 변환이 **모델의 일부가 된다**는 의미이다. 
예를 들어, 정사각형 땅이 있고, 한 변의 길이로 땅의 가격을 예측한다고 해보자. 
그렇게 단순히 길이를 사용하면 선형 관계가 아니라 예측 결과가 딱히 좋지 않다.
가격은 땅의 면적에 비례하여 거래될 것이기 때문이다.

하지만 **Length² = 면적(Area)** 이라는 새로운 특성을 만들어 사용하면 선형 관계가 성립하고, 우리의 모델은 예측에 더 잘 맞춰질 것이다.

![image](https://storage.googleapis.com/kaggle-media/learn/images/BLRsYOK.png)

- *왼쪽 그래프: x축에 면적을 사용한 경우 — 직선에 잘 맞는다.*
- *오른쪽 그래프: x축에 길이를 사용한 경우 — 곡선이 필요하지만, 기존 선형 모델은 잘 맞지 않는다.*

위 예시를 본다면, Feature Engineering에 시간을 들일 가치가 충분하다는 걸 알 수 있다.
**모델이 학습할 수 없는 관계**를 우리가 직접 변형을 해서 모델에게 제공할 수 있는 것이다.


## Example - Concrete Formulations

우리는 랜덤 포레스트 모델의 예측 성능을 향상시키는 예제를 살펴보자.
몇 가지의 **합성 특성(synthetic feature)** 을 추가해볼 것이다. 

[Concrete](https://www.kaggle.com/datasets/sinamhd9/concrete-comprehensive-strength) 데이터셋에는 다양한 콘크리트 조성과 압축 강도(compressive strength)가 포함되어 있다.
우리의 목표는 주어진 조성으로부터 콘크리트의 압축 강도를 예측하는 것입니다. 
조성이 입력 x가 되고, 압축 강도 y를 예측하는 모델을 만들어야한다.

```python
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import cross_val_score

df = pd.read_csv("../input/fe-course-data/concrete.csv")
df.head()
```

| Cement | BlastFurnaceSlag | FlyAsh | Water | Superplasticizer | CoarseAggregate | FineAggregate | Age | CompressiveStrength |
|--------|----------------|--------|-------|------------------|----------------|--------------|-----|-------------------|
| 540.0  | 0.0            | 0.0    | 162.0 | 2.5              | 1040.0         | 676.0        | 28  | 79.99             |
| 540.0  | 0.0            | 0.0    | 162.0 | 2.5              | 1055.0         | 676.0        | 28  | 61.89             |
| 332.5  | 142.5          | 0.0    | 228.0 | 0.0              | 932.0          | 594.0        | 270 | 40.27             |
| 332.5  | 142.5          | 0.0    | 228.0 | 0.0              | 932.0          | 594.0        | 365 | 41.05             |
| 198.6  | 132.4          | 0.0    | 192.0 | 0.0              | 978.4          | 825.5        | 360 | 44.30             |

현재 데이터에 다양한 성분이 있으니, 이를 잘 조합해서 모델이 학습하기에 좋은 새로운 특성을 추가해보자.

새로운 특성을 추가했을 때 정말 도움이 되는지 확인하는 것도 중요하므로, 그 **평가의 기준점**을 설정하자.

```python
X = df.copy()
y = X.pop("CompressiveStrength")

# Train and score baseline model
baseline = RandomForestRegressor(criterion="absolute_error", random_state=0)
baseline_score = cross_val_score(
    baseline, X, y, cv=5, scoring="neg_mean_absolute_error"
)
baseline_score = -1 * baseline_score.mean()
print(f"MAE Baseline Score: {baseline_score:.4}")
```

```
MAE Baseline Score: 8.232
```

여기서 MAE (Mean Absolute Error) score는 모델의 예측값과 실제값의 절댓값 차이를 모두 더해 평균낸 지표로, 회귀 모델 성능 지표 중 하나이다.


만약 요리를 해본 적 있다면, 재료의 비율이 절대적 양보다 훨씬 더 중요한 경우가 많음을 알고 있을 것이다.
비슷한 논리로, 콘크리트 성분의 **비율**이 강도를 잘 예측해줄 수 있을 것이라고 추측할 수 있다.

다음 코드로 세 가지 새로운 비율 기반 특성을 추가한다.

```python
X = df.copy()
y = X.pop("CompressiveStrength")

# Create synthetic features
X["FCRatio"] = X["FineAggregate"] / X["CoarseAggregate"]
X["AggCmtRatio"] = (X["CoarseAggregate"] + X["FineAggregate"]) / X["Cement"]
X["WtrCmtRatio"] = X["Water"] / X["Cement"]

# Train and score model on dataset with additional ratio features
model = RandomForestRegressor(criterion="absolute_error", random_state=0)
score = cross_val_score(
    model, X, y, cv=5, scoring="neg_mean_absolute_error"
)
score = -1 * score.mean()

print(f"MAE Score with Ratio Features: {score:.4}")
```

```
MAE Score with Ratio Features: 7.948
```

MAE가 기존보다 감소하였다는 것은, 예상대로 **성능이 향상되었다.** 이 예시로 새로운 비율 특성들이 모델이 이전에 감지하지 못했던 중요한 정보를 제공했다는 것을 보여준다.


## 계속하기

새로운 특성을 추가한다면 모델의 성능을 향상시킬 수 있음을 알게 되었다. 다만 어떤 특성을 어떻게 결합해야 좋을지 아직 
판단할 수는 없으므로, 다음 장에서는 `mutual information`이라는 개념을 활용하여 유용한 정보를 식별하는 방법을 배워본다.
