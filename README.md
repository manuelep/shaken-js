# Shaken-js
    Shaken, not stirred. A refreshing way to drink JavaScript.

## What's it?

Just a lightweight javascript framework with no future.

## Does it really works?

[So it seams](https://manuelep.github.io/shaken-js/).

## Usage examples

> *WARNING*
> Following examples have not been really tested, but sould work.
> Feel free to open issues about them in case of troubles.

### Easy

* HTML Code
  ```html
  <h2 id="mytitle" class="title item-title is-size-4 has-text-weight-extra-bold" data-name="strDrink">
      My Cocktail
  </h2>
  ```
* Javascript Code
  ```js
  new LocalComponent('mytitle').compile({strDrink: "Vesper Martini"});
  ```

### Less easy

* HTML Code
  ```html
  <table class="table">
    <thead>
        <tr>
          <th>Ingredients</th>
          <th>Measures</th>
        </tr>
    </thead>
    <tbody id="cocktail-ingredients">
        <!-- Content of this tag will be used as a template and repeated looping over ingredients varialbe values -->
        <tr data-name="ingredients">
            <!-- Where ingredient variable value will be shown -->
            <td data-name="ingredient"></td>
            <!-- Where measure variable value will be shown -->
            <td data-name="measure"></td>
        </tr>
    </tbody>
  </table>
  ```

* Javascript Code 1
  ```js
  new LocalComponent('cocktail-ingredients').compile({ingredients: [
      {ingredient: "gin", measure: "3 ounces"},
      {ingredient: "vodka", measure: "1 ounce"},
      {ingredient: "Lillet Blanc", measure: "1/2 ounce"}
  ]});
  ```

### Remote component usage

As alternative the THML element could be retrieved at a certain url, in this case the alternative code should be a bit different:

* Local HTML Code
  ```html
  <div id="cocktail-ingredients-table-here"></div>
  ```
* Remote HTML Code
    See previouse example

* Javascript Code 2
  ```js
  let myComponent = new RemoteComponent('http://somehost.com/path/to/template.html', 'cocktail-ingredients-table-here')
  myComponent.load().then(el=>{
      myComponent.compile({ingredients: [
          {ingredient: "gin", measure: "3 ounces"},
          {ingredient: "vodka", measure: "1 ounce"},
          {ingredient: "Lillet Blanc", measure: "1/2 ounce"}
      ]});
  });
  ```


