# searchO

`searchO` search in array of object based on search string.

## Install

Install with npm:

```sh
npm i searcho --save
```

Install with yarn:

```sh
yarn add searcho
```

## Example

Here is an Exapmle <a href="https://stackblitz.com/edit/js-1hnjgy">Link to stackblitz</a>.

###### index.js (with pagination)

```js
import search from 'searcho';

let data =[
    { name: "Black Widow" },
    { name: "Maria Hill" },
    { name: "Captian America" },
    { name: "Iron Man" },
    { name: "Clint Barton" },
    { name: "Thor" },
    { name: "Hulk" },
    { name: "Nick Fury" },
    { name: "Loki" },
    { name: "Captain Marvel" }
]
let searched = search({
    data : data,
    search: "c",
    page: 1,
    size: 2
})

console.log(searched)

```



###### output
 
 `total` represent number of entries. <br/>
 `filted` represent number of entries filted.<br/>
 `data` respresent  data on paticular page. if  `page:null` all filted will be represented in data.
 
```json
{
  "data": [ { "name": "Captian America" }, { "name": "Clint Barton" } ],
  "filted": 5,
  "total": 10
}
```

###### index.js (all searched result)

`page:null`

```js
import search from 'searcho';

let data =[
    { name: "Black Widow" },
    { name: "Maria Hill" },
    { name: "Captian America" },
    { name: "Iron Man" },
    { name: "Clint Barton" },
    { name: "Thor" },
    { name: "Hulk" },
    { name: "Nick Fury" },
    { name: "Loki" },
    { name: "Captain Marvel" }
]
let searched = search({
    data : data,
    search: "c",
})

console.log(searched)

```
###### output
```json
{
  "data": [
    { "name": "Captian America" },
    { "name": "Clint Barton" },
    { "name": "Captain Marvel" },
    { "name": "Black Widow" },
    { "name": "Nick Fury" }
  ],
  "filted": 5,
  "total": 10
}

```

###### index.js (search on selected columns)

```js
import search from 'searcho';


let data = [
    {
        name: "Black Widow",
        gender: "female",
        age: 40,
        DOB: "1994-11-05T13:15:30Z"
    },
    {
        name: "Maria Hill",
        gender: "female",
        age: 43,
        DOB: "1996-11-05T13:15:30Z"
    },
    {
        name: "Captian America",
        gender: "male",
        age: 110,
        DOB: "1928-11-05T13:15:30Z"
    },
    { 
        name: "Iron Man",
        gender: "male",
        age: 55,
        DOB: "1960-11-05T13:15:30Z" },
    {
        name: "Clint Barton",
        gender: "male",
        age: 39,
        DOB: "1987-11-05T13:15:30Z"
    },
    { 
        name: "Thor",
        gender: "male",
        age: 140,
        DOB: "1900-11-05T13:15:30Z"
    },
    { 
        name: "Hulk",
        gender: "male",
        age: 50,
        DOB: "1968-11-05T13:15:30Z"
    },
    { 
        name: "Nick Fury",
        gender: "male",
        age: 55,
        DOB: "1965-11-05T13:15:30Z" },
    { 
        name: "Loki",
        gender: "male",
        age: 130,
        DOB: "1910-11-05T13:15:30Z"
    },
    {
        name: "Captain Marvel",
        gender: "female",
        age: 29,
        DOB: "1990-11-05T13:15:30Z"
    }
];
let searched = search({
    data : data,
    search: "3",
},{
    searchCols: ['age'],
})

console.log(searched)

```
###### output ( searched only on age )
```json
{
  "data": [
    {
      "name": "Clint Barton",
      "gender": "male",
      "age": 39,
      "DOB": "1987-11-05T13:15:30Z"
    },
    {
      "name": "Maria Hill",
      "gender": "female",
      "age": 43,
      "DOB": "1996-11-05T13:15:30Z"
    },
    {
      "name": "Loki",
      "gender": "male",
      "age": 130,
      "DOB": "1910-11-05T13:15:30Z"
    }
  ],
  "filted": 3,
  "total": 10
}

```


###### index.js ( search on rows where gender is female )

```js
let searched = search({
    data : data,
    search: "c",
},{
    filter: {
        gender: "female"
    }
})

console.log(searched)

```
###### output  
```json

{
  "data": [
    {
      "name": "Captain Marvel",
      "gender": "female",
      "age": 29,
      "DOB": "1990-11-05T13:15:30Z"
    },
    {
      "name": "Black Widow",
      "gender": "female",
      "age": 40,
      "DOB": "1994-11-05T13:15:30Z"
    }
  ],
  "filted": 2,
  "total": 10
}

```


###### index.js ( search on rows where age is in between )

```js
let searched = search({
    data : data,
    search: "c",
},{
    filter: {
      //gender: "female",
        age: {
            type: "number",
          //value: 55, for paticular value
            min: 49, // null to ignore min
            max: 100 // null to ignore max
        },
    }
})

console.log(searched)

```
###### output  
```json

{
  "data": [
    {
      "name": "Nick Fury",
      "gender": "male",
      "age": 55,
      "DOB": "1965-11-05T13:15:30Z"
    }
  ],
  "filted": 1,
  "total": 10
}

```

###### index.js ( search on rows where date is in between )

```js
let searched = search({
    data : data,
    search: "c",
},{
    filter: {
    //    gender: "female",
    //    age: {
    //         type: "number",
    //         value: 55, for paticular value
    //         min: 49,
    //         max: 100
    //    },
          DOB: {
            type: "date",
            min: "1970-11-05T13:15:30Z",
            max: "1989-11-05T13:15:30Z"
          }
    }
})

console.log(searched)

```
###### output  
```json

{
  "data": [
    {
      "name": "Clint Barton",
      "gender": "male",
      "age": 39,
      "DOB": "1987-11-05T13:15:30Z"
    }
  ],
  "filted": 1,
  "total": 10
}
```