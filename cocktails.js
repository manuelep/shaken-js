class Cocktails extends LocalComponent {
    append (n=3, notOverwite) {
        let promises = [];
        for (const ii of Array(n).keys()) {
            promises.push(this.fetchData());
        };
        Promise.all(promises).then(resp => resp.map(r => r.drinks[0])).then(cocktails => {
            let infos = [];
            cocktails.forEach(cocktail => {
                // Just adapting the resource output to Shaken-js logic
                let ingredients = Array.from(new Set(Object.keys(cocktail).filter(k => k.startsWith("strIngredient")&&cocktail[k]).map(k => {return {ingredient: cocktail[k]}})));
                let measures = Array.from(new Set(Object.keys(cocktail).filter(k => k.startsWith("strMeasure")&&cocktail[k]).map(k => {return {measure: cocktail[k]}})));
                let mix = ingredients.map((e, i) => {return {...e, ...measures[i]}});
                // now ingredients has value like: [{ingredient: "The ingredient name", measure: "The ingredient measure"}, ...]
                infos.push({...cocktail, ingredients: mix});
            });
            console.log(infos);
            component.compile({recipes: infos}, notOverwite);
        });
    };
}
