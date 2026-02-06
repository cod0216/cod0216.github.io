---
title: Java - Integer Pool
date: 2024-03-02 00:00:00 +0900
categories: [Programing, Java]
tags: [Java]
toc: true
comments: true
---

## Integer Pool이란?

자바는 성능 최적화를 위해 **`-128`부터 `127`까지의 Integer 객체를 미리 생성해 재사용**한다.

이렇게 미리 만들어진 Integer 객체들의 집합을 흔히 **Integer Pool**이라고 한다.

```java
Integer a = 100;
Integer b = 100;

a == b // true
```

위 코드에서 `a == b`가 `true`로 평가되는 이유는,

`100`이라는 값이 Integer Pool의 캐싱 범위에 포함되어 있기 때문이다.

## 알고리즘에서 조건문이 안 탔던 문제

알고리즘 문제를 풀다 보면 다음과 같은 상황을 경험했다.

> 값은 분명 같은데 `if` 문이 실행되지 않는다.
> 

```java
Integer cur = 128;
Integer target = 128;

if (cur == target) {
    // 실행되지 않음
}
```

디버깅을 해보면 `cur`과 `target` 모두 `128`이다.

그런데도 조건문은 통과하지 않는데

특히 흥미로운 점은,

- 작은 값에서는 정상 동작하고
- 특정 값 이상부터 조건이 맞지 않는다는 것이다.

이 현상은 알고리즘 로직의 문제가 아니라,

**자바에서 객체를 비교하는 방식**에서 비롯된다.

## `==` 연산자의 이해

이 문제의 핵심에는 **`==` 연산자**가 있다.

자바에서 `==`는 객체의 값(value)을 비교 하는 것이 아닌

참조(reference), 즉 **같은 객체를 가리키는지** 확인한다.

```java
Integer a = new Integer(100);
Integer b = new Integer(100);

a == b // false
```

두 객체는 값은 같지만,

서로 다른 객체이기 때문에 참조 비교 결과는 `false`이다.

즉, `==`는 “같은 값을 가지고 있는가?”가 아니라

“같은 객체(참조)인가?”를 묻는 연산자다.

## 그런데 왜 어떤 값에서는 `true`가 나왔을까?

여기서 다시 **Integer Pool** 개념으로 돌아가야 한다.

```java
Integer a = 100;
Integer b = 100;

a == b // true
```

`100`은 Integer Pool의 캐싱 범위인 **`-128 ~ 127`** 안에 포함된다.

이 범위의 값에 대해서 자바는 **이미 생성해 둔 하나의 Integer 객체를 재사용**한다.

따라서 위 코드에서:

- `a`와 `b`는 각각 다른 변수가 아니라
- **동일한 Integer 객체를 참조**하게 된다.

그 결과,

- 값이 같아서 `true`가 나온 것이 아니라
- **참조가 같기 때문에 `true`가 나온 것**

반면, Pool 범위를 벗어난 값의 경우에는 상황이 달라진다.

```java
Integer cur = 128;
Integer target = 128;

cur == target // false
```

`128`은 Integer Pool에 포함되지 않으므로,

오토박싱 과정에서 **매번 새로운 Integer 객체가 생성된다.**

즉 값은 같지만 참조는 다르기 때문에

`==` 비교 결과는 `false`가 된다.

## 정답을 맞춰보자

**Q1**

```java
int a = 100;
int b = 100;

System.out.println(a == b);
```

**Q2**

```java
Integer a = 100;
Integer b = 100;

System.out.println(a == b);
```

**Q3**

```java
Integer a = 128;
Integer b = 128;

System.out.println(a == b);
```

**Q4**

```java
List<Integer> list = new ArrayList<>();
list.add(439);

Integer x = list.get(0);

System.out.println(x == 439);
System.out.println(x.equals(439));
```

**Q5**

```java
List<Integer> list = new ArrayList<>();
list.add(540);

if (list.get(0) == 540) {
    System.out.println("같다");
}
```

**Q6**

```java
Integer a = 128;
int b = 128;

System.out.println(a == b);
```

### 정답

| 문제 | 출력 | 핵심 이유 |
| --- | --- | --- |
| Q1 | true | 기본형 값 비교 |
| Q2 | true | Integer Pool 참조 재사용 |
| Q3 | false | Pool 범위 밖, 참조 다름 |
| Q4 | false / true | `==`는 참조, `equals()`는 값 |
| Q5 | 출력 없음 | Pool 범위 밖 + `==` |
| Q6 | true | 언박싱 후 기본형 비교 |
