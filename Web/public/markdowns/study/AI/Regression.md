# Regression

회귀 (Regression)이란 수치형 결과를 분석, 예측하는 데 사용되는 머신러닝의 대표적인 **지도 학습** 방법론이다.

우리가 예측하기를 목표로 하는 Target variable 이 연속적인 값을 가진다면 적용할 수 있다.

두 개 이상의 변수들 간의 관계 - 우리가 정보를 얻고 

일반적인 프로그래밍에서, 우리는 함수 f(x)를 고안하여 입력 x에 대한 출력 y를 얻는다.

회귀에서는 데이터 (x, y)가 주어진다면 이를 예측하는 함수 f(x) 를 고안해내고, 새로운 데이터 new_x가 들어왔을 때도 그것에 대한
결과를 예측하도록 한다. 

#### - Regression

고양이의 이미지를 보고 나이가 5.5세 일것 이라고 예측하면, 회귀 문제 이다.

#### - Classification 

고양이 이미지를 보고 개 / 고양이 / 햄스터 중 고양이 일 것이라고 분류하면, 분류 문제이다.

# LINEAR MODEL 

K-NN 등의 알고리즘들은 런타임에서 느리다. 선형 모델은 훈련이나 실 사용에서도 매우
빠르게 동작한다. 또한 선형 모델 등의 단순한 모델들은 **interpretable**하다.

Linear regression은 regression 문제에 사용되고, Logistic regression은 classification에 사용된다.

## Linear Regression Model

각각의 학습 샘플인 $(x_i, y_i)$가 있다고 할 때, 

**단순 선형 회귀 simple linear regression**

$y_i = w_0 + w_1 x_i + \epsilon _ i$ 

여기서

$w_0$ : bias (편향) 

$w_1$ : weight (가중치)

$\epsilon_i$ : 실제값과 예측값의 오차값이다. 일반적으로 정규분포 $N(0, \sigma ^2)$ 을 따른다고 가정한다. 

**다중 선형 회귀 multiple linear regression**

$y_i = w_0 + w_1 x_{i1} + ... + w_p x_{ip} + \epsilon _ i$

$y_{pred} = f_w(\mathbf{x}) = w_0 + w_1 x_{i1} + ... + w_p x_{ip} = \mathbf{w}^T\mathbf{x}$

이것은 vector $(w_0, w_1, w_2, ... , w_p)$와 vector $(1, x_1, x_2, ... , x_p)$ 의 내적으로 볼 수 있다. 

다시 이것을 Vector notation 으로 확인해보자. 

Minimize $$ (\mathbf{y-Xw})^2, (\mathbf{y-Xw})^T(\mathbf{y-Xw}) $$

선형 회귀에서는 다음을 가정한다.
- x와 y의 관계가 선형적이라고 가정한다.
- 잔차 (error)가 각 x에 대해서 normally distributed 되어 있을 것이라고 가정한다.

그렇다면 어떠한 가장 ***best_fit*** 하다고 말할 수 있을 까? 예측값과 실제 값 y의 차이의 합을 
최소화 하는 것이 가장 최적이지 않을까?  

## OLS estimator 

최소 제곱해를 찾아 선형회귀 모델을 추정하는 법을 OLS라고 한다. 

RSS (SSE), MSE 등의 여러 평가 지표가 존재한다.

#### 잔차 제곱합 (RSS) : Residual Sum of Squares

$$RSS = \sum (Y_i - \hat{Y}_i)^2$$ 
말 그대로 잔차 (오류)치 합의 제곱을 나타낸다. SSE ( Sum of Squared Errors ) 라고도 한다.

#### MSE : Mean Squared Errors

$$ \frac{1}{n} \sum\limits_{i = 1}^n [ y^{(i)} - H(x^{(i)}) ]^2 $$

잔차 제곱 합을 샘플 수 n 으로 나누어 평균을 낸 것을 MSE 이라고 한다.

MSE 값이 낮을 수록 오차가 적으니, 모델의 예측 성능이 높다고 할 수 있다.
그래서 우리는 MSE의 값을 Minimize 하도록 모델을 만들어야 한다. 이렇게 머신러닝에서
오차를 정의한 함수를 **손실 함수 (Loss Function)** 이라고 부른다. 

우리는 손실 함수를 최소화하는 파라미터를 찾고자 한다.

$$L(\mathbf{w}) = \sum\limits_{i = 1}^n (y_i - (w_0 + w_1x_{i1} + ... + w_px_{ip}))^2$$

대표적인 방법으로, 분석적 방법과 경사하강법이 있다.

## Analytic solution

Simple linear regression에서, 우리는 손실 함수를 최소화 하는 $w_0, w_1$을 찾으려고 한다.

여기서 전제 조건은 

1. `Convex function`, 볼록 함수여야 한다.
2. `Unique minimum point` - 유일한 최소점이 존재해야한다.

그러한 점을 찾는 것은, 미분해서 기울기가 0이 되는 점을 찾는 방법이 된다. 다시 말해서

$$\frac{\partial L(w_0, w_1)}{\partial w_0} = 0, \frac{\partial L(w_0, w_1)}{\partial w_1} = 0$$ 의
편미분으로 구할 수 있다.

실제로 계산해보자. 

#### least squares estimate 

$$\hat{w} = (\mathbf{X}^T\mathbf{X})^{-1}(\mathbf{X}^T\mathbf{y})$$

> 단 $\mathbf{X}^T\mathbf{X}$ 는 invertible 해야한다.

문제는, 역행렬을 계산하는 것은 계산에 있어서 시간과 메모리 비용이 많이 드는 작업이다.

따라서 데이터가 크다면, 우리는 **gradient descent**와 같은 근사적인 방법을 사용하게 된다.

# GRADIENT DESCENT

# LOGISTIC REGRESSION

# FEATURE SELECTION AND REGULARIZATION



















