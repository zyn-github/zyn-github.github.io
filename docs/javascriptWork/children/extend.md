# js继承
```code
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>zyn</title>
</head>
<body>
    <script>
        / js 设计模式 继承

        /**
            1. 第一种继承方式 类式继承
               思路： 创建父类用于被继承，创建子类(将父类的实例对象赋值于子类的原型可以实现继承)
               缺点:  1. 当父类使用的是引用类型的时候(Array)父类和子类操作的是一个引用地址，子类之间相互干扰
                      2. 这种继承方式，不能对父类的进行初始化，和对父类进行参数的传递   
                      3. 子类不是父类的实例，子类的原型才是父类的实例
        **/

        /// 创建父类用于被继承
        function SuperClass(id) {
            /// 在这里添加一个安全检查 当时实例化SuperClass类时候，不进行new 也可以正常执行
            if(this instanceof SuperClass) {
                /// 添加引用类型
                this.books = ['java', 'php', 'javascript'];
                this.SuperValue = true;
                this.id = id || 'n';
            }else{
                return new SuperClass();
            }    
        }
        SuperClass.prototype.getSupuerValue = function() {
            console.log(this.SuperValue);
            return this.SuperValue;
        }
        
          var su = SuperClass();   var su = new SuperClass();  su.getSupuerValue(); // true 两种调用方式相同

         /// 创建子类进行继承父类(SuperClass)
          function SubClass() {
              this.SubValue = false;
          }
          /// 进行继承
          SubClass.prototype = new SuperClass();
          /// 为子类添加共有方法
          SubClass.prototype.getSubValue = function() {
              console.log(this.SubValue);
              return this.SubValue;
          }
          console.warn('=====================类式继承=======================');
          var sub1 = new SubClass();
          var sub2 = new SubClass();
          /// 在这里子类不仅有自己的共有方法还有父类中的共有方法
          sub1.getSupuerValue(); /// true /// 这里子类并没有 getSupuerValue 方法而是继承自父类得到的
          sub1.getSubValue(); /// false 

          / 验证但是用引用类型时候产生的问题
          console.log(sub1.books);
          /// 父类引用类型的属性添加一个元素
          sub1.books.push('kk');
          console.log(sub2.books); /// 这里面新增了 'kk'




        /**
          2. 构造函数继承 解决类式继承 引用类型的问题
            思路：借由call方法实现 (父类).call('子类this', '参数');
            缺点：子类不能访问父类原型上的方法
        **/  
          /// 创建新的子类函数来继承父类，这里可以调用父类构造函数，给父类传递参数
          function SupNew(id) {
              this.id = id;
              this.books = ['java', 'php', 'javascript'];
          }
          SupNew.prototype.show = function() {
              console.log('SupNew')
          }
          function Suber(id) {
            SupNew.call(this, id);
          }
          console.warn('=====================构造函数继承=======================');
          var subnew1 = new Suber(10);
          var subnew2 = new Suber(20);
          /// 父类引用类型的属性添加一个元素
          subnew1.books.push('zyn');
          console.log(subnew1.books);
          console.log(subnew2.books);
          try {
            subnew2.show(); /// 这里子类无法访问父类的原型上的方法
          } catch (error) {
              console.log('这里子类无法访问父类的原型上的方法', error);
          }



        /**
          3. 组合式继承 (将上面的两种合并来实现) 将上面的两种缺点相互弥补
          思路：在继承中同时使用 类式继承和构造函数继承
          缺点: 构造模式继承的时候 执行了一次父类的构造函数，类式继承的时候也调用了一次父类的构造函数 一共执行了两次
               子类不是父类的实例,子类的原型才是父类的实例 
        **/
        /// 创建父类
        function ZHSuper(id) {
            this.id = id;
            this.books = ['java', 'php', 'javascript'];
        }
        ZHSuper.prototype.say = function() {
            console.log('ZHSuper, say')
        }
        /// 创建子类(同时使用 原型模式，构造函数模式)
        function ZHSub(id) {
             构造函数模式
            ZHSuper.call(this, id);
        }
         原型模式
        ZHSub.prototype = new ZHSuper(32);
        console.warn('=====================组合式继承=======================');
        var zh1 = new ZHSub(32);
        var zh2 = new ZHSub(90);
         引用类型不会相互干扰
        zh1.books.push('ZHSuper');
        console.log(zh1.books);
        console.log(zh2.books);
        zh2.say(); // 可以访问父类原型模式


        /**
            4. 纯净的 原型式继承
              思路：声明一个过度的函数对象，将传入的需要继承的函数 赋值给 过度函数的对象最后返回 过度函数的实例
              缺点: 会出现上面类式继承的引用类型错误
        **/

        function inheritObject(o) {
            /// 创建一个过度函数对象
            var _F = function() {}
            _F.prototype = o;
            return new _F()
        }

        console.warn('=====================原型式继承=======================');

        var Lesson = {
            books : ['java', 'php', 'javascript']
        }

        var less1 = inheritObject(Lesson);
        var less2 = inheritObject(Lesson);
        less1.books.push('liqiqi');
         该继承的方式  会出现上面类式继承的引用类型错误
        console.log(less2.books);
        console.log(less1.books);


       /**
            5. 寄生式的继承 (解决原型继承的问题)
               思路：寄生其实就是对原型式继承的一次封装
       **/
            
        function createLesson(o) {
            var obj = new inheritObject(o);
            /// 在这里还可以拓展方法
            obj.add = function() {
                console.log('寄生式的继承');
            }
            return obj;
        }
        console.warn('=====================寄生式的继承=======================');
        
        var ll1 = new createLesson(Lesson);
        var ll2 = new createLesson(Lesson);

        ll2.books.push('liqiqi');
         该继承的方式  会出现上面类式继承的引用类型错误
        console.log(ll1.books);
        console.log(ll2.books);


        /**
            6. 寄生组合式继承  最后的继承方式
              思路：寄生式继承依托于原型继承，原型式继承类似于类式继承，另外就是构造函数模式，子类不是父类的实例是由于类式继承引起的
        **/

        function inheritPrototype(subClass, SupClass) {
            // 赋值一份父类的原型保存在变量中   
            var p = inheritObject(SupClass.prototype);
            p.constructor = subClass;
            subClass.prototype = p;
        }


        function Animal(type) {
            this.type = type;
            this.colors = ['red', 'blue'];
        }
        Animal.prototype.show = function() {
            console.log('Animal show');
        }


        function Dog(type, lang) {
            /// 构造函数继承
            Animal.call(this, type);
            this.lang = lang;
        }
         寄生式继承

        inheritPrototype(Dog, Animal);

        /// 子类添加原型方法
        Dog.prototype.say = function() {
            console.log('Dog lang', this.lang);
        }

        /// 创建两个子类测试
        console.warn('=====================组合寄生式的继承=======================');
        var dj1 = new Dog('dog', 'en');
        var dj2 = new Dog('dog', 'cn');
        dj1.colors.push('black');
        console.log(dj1.colors);
        console.log(dj2.colors);
        dj2.show();
        dj1.say();
        dj2.say();
    </script>
</body>
</html>

```