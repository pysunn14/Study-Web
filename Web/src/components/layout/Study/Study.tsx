import MarkdownParser from "../../util/MarkdownParser.tsx";

export default function Study() {

    const content = `
    
# Study

* 공부 자료가 올라갈 예정입니다.


# Mathematics 

- Calculus  

- Linear Algebra

- Statistics

# AI

## Machine Learning

## Deep Learning

- ANN

- DNN

- CNN

- RNN


## Natural Language Processing

## Computer Vision

## Reinforcement Learning

## Library

- Tensorflow
- Pytorch
- Keras
- scikit-learn
- OpenCV
- NLTK 
- Hugging Face

# Parallel Processing

## CUDA
- cuBLAS
- cuDNN

## OpenCL

# PS

    `;

    return (
        <>
            <MarkdownParser content={content}></MarkdownParser>
        </>
    );
}