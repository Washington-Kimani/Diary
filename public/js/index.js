const title = document.getElementById('title')
const description = document.getElementById('description')
const date = document.getElementById('date')
const submit = document.getElementById('submit')

submit.addEventListener('submit', (e)=>{
    e.preventDefault()
    if(title.value == ''){
        alert('Please Enter the title!');
    }else if(description.value == ''){
        alert('Please Enter a description!')
    }else if(!date.value){
        alert('Please Enter A Date!')
    }
})