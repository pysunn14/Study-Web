
# Feature Engineering에 오신 것을 환영합니다!

이 과정에서는 훌륭한 머신러닝 모델을 만들기 위한 가장 중요한 단계 중 하나인 **Feature Engineering(특성 엔지니어링)** 에 대해 배웁니다. 여러분은 다음과 같은 기술들을 배우게 됩니다:

- 상호 정보(mutual information)를 사용해 가장 중요한 특성을 판단하는 방법
- 여러 실제 문제 도메인에서 새로운 특성을 만들어내는 방법
- 고유값이 많은 범주형 데이터를 타겟 인코딩(target encoding)으로 인코딩하는 방법
- K-평균 클러스터링(K-means clustering)으로 세분화된 특성 만들기
- 주성분 분석(PCA)으로 데이터의 변동을 분해하여 특성 만들기

실습을 통해 이 기술들을 하나씩 익히고, 최종적으로는 **House Prices Getting Started** 경진대회에 제출할 수 있는 완성된 노트북을 만들어 봅니다. 과정을 마친 후에는 여러분이 모델 성능을 더욱 향상시킬 수 있는 다양한 아이디어를 얻게 될 것입니다.

**준비되셨나요? 시작해봅시다!**

---

## Feature Engineering의 목표

Feature Engineering의 목표는 **데이터를 현재 문제에 더 적합하게 만드는 것**입니다.

예를 들어 "체감 온도(apparent temperature)"를 생각해봅시다. 실제 기온, 습도, 바람 속도와 같은 측정 가능한 요소들을 바탕으로 사람들이 실제로 느끼는 온도를 계산한 것이죠. 즉, 관측된 데이터를 우리가 실제로 관심 있는 정보에 맞게 변형한 것, 이것이 Feature Engineering의 일종이라고 할 수 있습니다.

Feature Engineering은 다음과 같은 이유로 수행됩니다:

- 모델의 **예측 성능 향상**
- **계산량 또는 데이터 요구량 감소**
- 결과의 **해석 용이성 향상**

---

## Feature Engineering의 핵심 원칙

특성이 유용하기 위해서는 **목표값(target)** 과 모델이 학습할 수 있는 **관계**가 있어야 합니다.

예를 들어 선형 모델(linear model)은 **선형 관계만 학습**할 수 있습니다. 따라서 선형 모델을 사용할 때는 특성과 목표값 간의 관계를 **선형화**하도록 변형해야 합니다.

이 말은 곧, 특성에 적용하는 변환이 **모델의 일부가 된다**는 뜻입니다. 예를 들어, 정사각형 땅의 **한 변의 길이(Length)** 를 가지고 **가격(Price)** 을 예측한다고 해봅시다. 단순히 Length만을 사용하면 선형 관계가 아니라 결과가 좋지 않습니다.

하지만 **Length² = 면적(Area)** 라는 새로운 특성을 만들어 사용하면 선형 관계가 성립하고, 모델은 더 잘 맞춰집니다.

- 왼쪽 그래프: x축에 면적(Area)을 사용한 경우 — 직선이 잘 맞음
- 오른쪽 그래프: x축에 길이(Length)를 사용한 경우 — 곡선이 필요하지만, 기존 선형 모델은 잘 맞지 않음

이 사례는 Feature Engineering에 시간을 들일 가치가 충분하다는 점을 보여줍니다. **모델이 학습할 수 없는 관계**를 **변형을 통해 직접 제공**해줄 수 있기 때문입니다.

---

## 예제 - 콘크리트 조성

이 개념을 실제로 보기 위해, 몇 가지 **합성 특성(synthetic feature)** 을 추가해 **랜덤 포레스트 모델**의 예측 성능을 향상시키는 예제를 살펴보겠습니다.

**Concrete 데이터셋**에는 다양한 콘크리트 조성과 그로부터 나온 **압축 강도(compressive strength)** 가 포함되어 있습니다. 우리의 목표는 주어진 조성으로부터 콘크리트의 압축 강도를 예측하는 것입니다.

```python
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import cross_val_score

df = pd.read_csv("../input/fe-course-data/concrete.csv")
df.head()
```

| Cement | BlastFurnaceSlag | FlyAsh | Water | Superplasticizer | CoarseAggregate | FineAggregate | Age | CompressiveStrength |
|--------|------------------|--------|-------|------------------|------------------|----------------|------|----------------------|
| 540.0  | 0.0              | 0.0    | 162.0 | 2.5              | 1040.0           | 676.0          | 28   | 79.99                |
| 540.0  | 0.0              | 0.0    | 162.0 | 2.5              | 1055.0           | 676.0          | 28   | 61.89                |
| 332.5  | 142.5            | 0.0    | 228.0 | 0.0              | 932.0            | 594.0          | 270  | 40.27                |

이 데이터에는 다양한 성분들이 포함되어 있습니다. 우리는 이들을 조합하여 모델이 더 잘 학습할 수 있도록 새로운 특성을 추가해볼 것입니다.

우선 **기본 모델**을 학습시켜, 새로운 특성이 실제로 도움이 되는지 평가하기 위한 기준점(baseline)을 설정합니다.

```python
X = df.copy()
y = X.pop("CompressiveStrength")

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

요리를 해본 적 있다면, **재료의 비율**이 **절대적인 양**보다 더 중요한 경우가 많다는 걸 아실 겁니다. 마찬가지로, 콘크리트 성분의 **비율**이 강도를 잘 예측해줄 수 있을 것이라고 추측할 수 있습니다.

다음 코드는 세 가지 새로운 **비율 기반 특성**을 추가합니다.

```python
X = df.copy()
y = X.pop("CompressiveStrength")

X["FCRatio"] = X["FineAggregate"] / X["CoarseAggregate"]
X["AggCmtRatio"] = (X["CoarseAggregate"] + X["FineAggregate"]) / X["Cement"]
X["WtrCmtRatio"] = X["Water"] / X["Cement"]

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

예상대로 **성능이 향상**되었습니다! 이것은 새로운 비율 특성들이 모델이 이전에 감지하지 못했던 중요한 정보를 제공했다는 것을 보여줍니다.

---

## 계속하기

이번 장에서는 새로운 특성을 추가하여 모델의 성능을 향상시킬 수 있다는 것을 보았습니다. 하지만 **어떤 특성을 결합하면 좋을지**는 어떻게 판단할 수 있을까요?

다음 장에서는 **상호 정보(mutual information)** 를 통해 유용한 특성을 식별하는 방법을 배워봅니다.

---

필요하시면 다음 장도 계속 번역해드릴게요!