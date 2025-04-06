# Recurrent Neural Network

## Introduction

RNN은 Sequence Data를 처리하는 데에 특화된 신경망이다.

시간적으로 순서가 있는 데이터 (문장, 음성 주식)등을 다루도록 설계되었다.

RNN은 은닉층(hidden layer)의 노드에서 활성화 함수(activation function)으로 나온 결과값을 
output 방향으로 보낸다.

이를 다시 은닉 노드의 input으로 보내는 특징이 있다.

![image](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FpSQYH%2Fbtrdf2YygE3%2FxrhyjKgsKwrf6VQOPcn2b1%2Fimg.png)

## Hidden State

메모리 셀이 각각의 시점 time step 에서, 바로 이전 시에서 나온 은닉층의 메모리 셀에서 나온 값을 자신의 입력으로 사용한다.

즉 현재 t 시점의 메모리 셀은 t-1 시의 메모리 셀이 보낸 은닉 상태값(hidden state)을 입력값으로 사용하는 것이다.

RNN에서는 입력과 출력의 길이를 자유롭게 조정해서 여러 분야에 활용할 수 있다.

#### OneToMany 구조
하나의 이미지 입력이 있을 때, 그 사진의 제목을 출력하는 Image Captioning 작업에 쓰일 수 있다.
제목은 여러 개의 단어의 나열이므로, 하나의 입력에 여러     개의 출력이 있는 셈이다.

#### ManyToOne 구조
입력받은 문서가 긍정적 / 부정적이다 라는 하나의 판단을 출력으로 주는 모델이나, 메일을 정상이나 스팸 메일로 분류하는 
spam detection에 활용할 수 있다.

#### ManyToMany 구조
사용자가 문장을 입력한다. 문장은 여러 단어로 구성되어 있고, 챗봇이 이에 대한 대답 문장을 출력한다. 

현재 시점 t에서의 은닉 상태값을 $h_t$라고 하자. 은닉층의 메모리 셀은 이를 계산하기 위해서
두 개의 가중치를 갖는다. $W_x$은 입력층을 위한 가중치이고, $W_h$은 이전 은닉 상태값을 위한 가중치이다.

여기서 하이퍼볼릭 탄젠트는 잘 알고 있는 시그모이드 활성화 함수의 선형 변환이다.

$tanh(x) = 2\sigma(2x) - 1$

$$h_t = tanh(W_x x_t + W_h h_{t-1} + b)$$

$$y_t = f(W_y h_t + b)$$

단 f는 non-linear한 activation function이다.

예를 들어 `나는 사과를 먹는다` 문장을 처리하는 경우를 생각해보자.

단어를 순서대로 입력한다.

`x0 = "나는" -> h0`

`x1 = "사과를" -> h1` RNN이 `나는`을 기억한 상태로 `사과를` 해석한다.

`x2 = "먹는다" -> h2` RNN이 `나는 사과를`을 기억한 상태로 `먹는다` 해석한다.

# Backpropagation Through Time

BPTT란 RNN에 계산되는 backpropagation으로, sequential data의 특성으 인해 발생하는 hidden state를 따라 역행하면서 전파되는 Gradient를 계산하는 방법이다. 

![image](http://solarisailab.com/wp-content/uploads/2017/05/backpropagation_through_time.png)

## Feed Forward Back Propagation

우선 일반적인 feed forward 신경망의 역전파 알고리즘을 RNN 구조에 맞춰 적용해보자.

Output Layer의 에러

$$e_o(t) = d(t) - y(t)$$

d(t): 정답 (target)

y(t): 예측값 (output)

출력 노드의 오차는 예측값과 실제값의 차이이다.

W : hidden layer -> output layer 로 가는 가중치이다. 

$$W(t+1) = W(t) + \eta s(t)e_0(t)^T$$

s(t): Hidden layer의 출력 (activation)

e_o(t): Output layer의 오차

η: 학습률 (learning rate)

output layer의 에러의 기울기 (gradient)는 hidden layer로 다음과 같이 역전파된다.

$$e_h(t) = d_h(e_o(t)^TV, t)$$

여기서 V는 Hidden → Output 간 가중치입니다. 이 에러를 hidden layer로 역전파합니다. 그런데 비선형 함수가 있으므로, chain rule에 따라 미분이 필요합니다.

여기서 d_h(.)는 다음과 같다.

$$d_{hj}(x, t) = xf'(net_j)$$

f': 활성화 함수의 도함수 (예: sigmoid → f'(x) = f(x)(1 - f(x)))

net_j: 해당 노드로 들어온 총 입력값

즉, 역전파에서 activation 함수의 gradient까지 고려해서 오차를 수정합니다.

V : Input layer에서 Hidden Layer로 가는 가중치

$$V(t+1) = V(t)+\eta x(t)e_h(t)^T$$

U : Hidden layer에서 Hidden layer로 순환되는 경로의 가중치

$$U(t+1) = U(t)+\eta s(t-1)e_h(t)^T$$

여기까지가 기존에 사용하던 Backpropagation 알고리즘을 RNN 구조 적용한 방식이다.

U는 RNN의 핵심인 **재귀적 연결(recurrent weight)** 이다.

## Backpropagation Through Time 사용 

여기서, hidden layer에서 output으로 가는 가중치 W는 똑같은 형태로 업데이트 한다. 왜냐하면
Output -> Hidden은 시간이 고정된 시점 t에서 계산되기 때문이다.

그러나 V : input -> hidden 와 U : hidden -> hidden 은 다음으로 계산해야한다.

$$e_h(t - \tau - 1) = d_h(e_h(t-\tau)U, t-\tau-1)$$

이것은 **일정 시간동안의 에러 값들을 합한 값**이다.

V : input -> hidden
U : hidden -> hidden 

$$V(t+1) = V(t) + \eta \sum \limits_{z=0}^T x(t-z)e_h(t-z)^T$$

$$U(t+1) = U(t) + \eta \sum \limits_{z=0}^T x(t-z-1)e_h(t-z)^T$$

이렇게 진행해야, **현재 시간의 error를 과거 시간 상태까지 역전파**할 수 있다. 하지만
이런 식으로 BPTT를 진행하면, 시퀀스의 처음부터 끝까지 전부 역전파를 해야하므로 계산량이 많아진다.
따라서 이를 완화하는 방법이 있다.

## Truncated BPTT

이러한 큰 길이의 시계열 데이터를 취급할 때는, 신경망을 적당한 길이마다 연결을 끊는다.
잘라낸 각각의 작은 Neural Network에서 backpropagation을 수행한다. 대개 5 time steps까지 보면서 에러를 역전파 한다.

# Python Implementation

Numpy를 활용하여 RNN layer를 구현해보자.

- 초기의 은닉 상태는 0이다.
- 각 timestep 마다 input과 은닉 상태로 연산을 진행한다.
- 그 계산 결과가 현재 시점의 은닉 상태가 된다. 

# Deep Recurrent Neural Network

RNN은 다수의 은닉층을 지닐 수 있다. 

![image](https://wikidocs.net/images/page/22886/rnn_image4.5_finalPNG.PNG)

기존 순환 신경망에서 은닉층이 1개 더 추가되어 2개인 깊은 순환 신경망의 모습이다. 

# Bidirectional Recurrent Neural Network 

양방향 순환 신경망은, 과거 시점의 입력 뿐만 아니라 미래 시점의 입력으로부터도 힌트를 얻을 수 있다면 사용한다.

![image](https://wikidocs.net/images/page/22886/rnn_image5_ver2.PNG)

하나의 출력값을 예측하기 위해 두 개의 메모리 셀을 사용한다. 
첫 번째 메모리 셀은 **Forward States**를 전달받는다.
두 번째 메모리 셀은 **Backward States**를 전달받는다.

$$  

\begin{align*}
\overrightarrow{h}_t &= \sigma\left(W_{x h}^\to x_t + W_{h h}^\to \overrightarrow{h}_{t-1} + b_h^\to \right) \\
\overleftarrow{h}_t &= \sigma\left(W_{x h}^\leftarrow x_t + W_{h h}^\leftarrow \overleftarrow{h}_{t+1} + b_h^\leftarrow \right) \\
y_t &= W_{h y}^\to \overrightarrow{h}_t + W_{h y}^\leftarrow \overleftarrow{h}_t + b_y
\end{align*}

$$

$\sigma$는 ReLU나 sigmoid등의 활성화 함수이다.   



양방향 RNN도 마찬가지로 은닉층을 여러 개 지닐 수 있다. 

![image](https://wikidocs.net/images/page/22886/rnn_image6_ver3.PNG)

다른 신경망 모델처럼, 은닉층을 늘린다고 반드시 모델의 성능이 좋아지지 않는다. 
은닉층이 늘어날수록 학습할 양이 많아지지만 그만큼 많은 훈련 데이터가 필요하다.

