# Long Short-Term Memory (LSTM)

## Introduction

바닐라 RNN에는 장기 의존성 문제(the problem of Long-Term Dependencies)가 존재한다.

$$h_t = tanh(W_x x_t + W_h h_{t-1} + b)$$

다시 기존 RNN을 보면, 두 개의 input이 각각의 가중치에 곱해져 셀의 입력이 된다. 
그것을 하이퍼볼릭 탄젠트 활성화 함수를 적용해, hidden state가 된다.

## LSTM

![image](https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/LSTM_Cell.svg/1200px-LSTM_Cell.svg.png)

전통적인 RNN의 단점을 보완한 RNN의 일종으로, **장단기 메모리(Long Short-Term Memory)** 라고 한다.

LSTM은 은닉층의 셀에 입력 게이트, 망각 게이트, 출력 게이트를 추가한다.

불필요한 기억은 지우고, 필요한 기억을 정한다.

즉 LSTM은 hidden state의 계산식이 RNN에 비해 좀 더 복잡해지고, **셀 상태(cell state)** 가 추가되었다.

### 입력 게이트

$$i_t = \sigma (W_{xi} x_t + W_{hi} h_{t-1} + b_i)$$

$$g_i = tanh(W_{xg} x_t + W_{hg} h_{t-1} + b_g)$$

입력 게이트는 현재 정보를 기억하는 게이트이다. 






### 삭제 게이트

### 셀 상태

### 출력 게이트와 은닉 상태

