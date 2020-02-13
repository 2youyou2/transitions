# transitions

This project is a port of TheAviator based on Cocos Creator 2.3.0.

Online Demo : http://2youyou2.com/transitions

# usage

![image](https://user-images.githubusercontent.com/1862402/74312784-49240600-4dad-11ea-9fd4-a6d560d1ed43.png)

1. Add transitions node to the scene, the transitions node will make itself as a persist node.
2. Select a transition in the Properties Panel.
3. Use **transitions.loadScene** instead of **cc.director.loadScene**
example: 
```js
// cc.director.loadScene(url, this.onLoadSceneFinish.bind(this));
this.transitions.loadScene(url, 'Canvas/Main Camera', 'Canvas/Main Camera', this.onLoadSceneFinish.bind(this));
```

# shaders

All shaders can be found in the folder: [assets/resources/transitions/shaders](https://github.com/2youyou2/transitions/tree/master/assets/resources/transitions/shaders)

Builtin uniforms: 
```js
{
  texture: { value: white }
  texture2: { value: white }
  time: { value: 0 }
  ratio: { value: 1 }
}
```
# Sources

- https://gl-transitions.com/
