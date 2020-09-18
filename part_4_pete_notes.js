
// -- start with the signatures table 
// -- give an array to handlebars and print smth out
// -- signers by city - join querry - colon in route


app.get("./signers/:city", (req,res)) {
    req.params.city // make lower case first
}

{{#signers}}
    {{#if url}}
        <a href="dfdfd"> name
    {{else}}
        {{first}} {{last}}
    {/if}

{{/signers}}


WHERE LOWER(city) = LOWER($1)

hackattack!!
// have to do it server side !!
take url and use friend startswith http:// or https://
