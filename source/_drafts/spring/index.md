1. 扫描类
2. 构建 BeanDefintion,放到 Map 容器
3. BeanFactoryPostProcessor 增强  BeanDefintion。如设置属性值
4. 通过代理 创建Bean的实例
5. 调用 invokeAwareMethod 方法执行 Aware 接口方法设置属性， 如 beanName 
6. BeanPostProcessor 前置方法， 设置属性 如 ApplicationContext
7. InitMenthod 接口方法， 如 afterPropertieSet
8. BeanPostProcessor 后置方法， 设置属性 如 ApplicationContext
9. Destracution 接口方法， 如 PreDestory