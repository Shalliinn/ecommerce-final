
document.addEventListener('DOMContentLoaded',ready)


function ready(){
   pageload(1);
   displayCart();
}

const open = document.getElementById("open");
const open1 = document.getElementById("open-cart");
const cancel = document.getElementById("cancel");
const container = document.getElementById("pcontainer");

var removeCartItemButtons=document.getElementsByClassName("btn-danger");
for(var i=0;i<removeCartItemButtons.length;i++){
    var button =removeCartItemButtons[i];
   // console.log('62');
    button.addEventListener('click',removeCartItem)
    }

var quantityInputs=document.getElementsByClassName('cart-quantity-input')
for(var i=0;i<quantityInputs.length;i++){
var input=quantityInputs[i]
//console.log('69');
input.addEventListener('change',quantityChanged)
}


// var addToCartButtons=document.getElementsByClassName('shop-item-button')
// for(var i=0;i<addToCartButtons.length;i++){
//     var button=addToCartButtons[i];
//     console.log('77');
//     button.addEventListener('click',addToCartClicked)
// }

    open.addEventListener('click',()=>{
        container.classList.add("active");
        displayCart()
    })
    open1.addEventListener('click',()=>{
        container.classList.add("active");
        displayCart()
    })
    
    cancel.addEventListener('click',()=>{
        container.classList.remove("active");
    })

document.getElementsByClassName('btn-purchase')[0].addEventListener('click',
purchaseClicked)
 document.getElementsByClassName('page')[0].addEventListener('click',function(){
    pageload(1);
})
 document.getElementsByClassName('page')[1].addEventListener('click',function(){
    pageload(2)})

function addToCart(product){
    console.log(product,'59');
   axios.post("http://localhost:3000/cart",{productId:product.id})
   .then(response=>{
      //  console.log();
        
    notification(product.title)
    
}).catch(err=>console.log(err))

}

function displayCart(){
    axios.get('http://localhost:3000/cart').then((data)=>{
        var cartItems=document.getElementsByClassName('cart-items')[0];
        cartItems.innerHTML="";
        const Data=data.data.products;
        
        for(var i=0;i<Data.length;i++){
            let Datainfo=Data[i]
            console.log(Datainfo.cartItem.quantity);
                var cartRow=document.createElement('div')
                cartRow.classList.add('cart-row')
          //  cartRow.innerText=title 
            var cartItems=document.getElementsByClassName('cart-items')[0];
        
            //var cartItemNames=cartItems.getElementsByClassName('cart-item-title')
            var cartRowConents=`
            <div class="cart-item cart-column">
                <img class="cart-item-image" src="${Datainfo.imageUrl}" width="100" height="100">
                <span class="cart-item-title">${Datainfo.title}</span>
            </div>
            <span class="cart-price cart-column">$${Datainfo.price}</span>
            <div class="cart-quantity cart-column">
                <input class="cart-quantity-input" type="number" value="${Datainfo.cartItem.quantity}">
                <button onClick="removeit(${Datainfo.id})"  class="btn btn-danger" type="button">REMOVE</button>
            </div> `
        
            cartRow.innerHTML=cartRowConents
            cartItems.append(cartRow)
            cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
            updateCartTotal()
        }
       
  
            })
}


function pageload(id){

    axios.get(`http://localhost:3000/?page=${id}`).then((data)=>{
     const Data=data.data.products
    console.log(Data);
   var shopItems=document.getElementsByClassName('shop-items')[1];
    shopItems.innerHTML="";
    for(var i=0;i<Data.length;i++){
        let Datainfo=Data[i]
        var shopItem=document.createElement('div')
    shopItem.classList.add('shop-item')
    //var shopItems=document.getElementsByClassName('shop-items')[1];
    
    var shopItemsContents=`
    <span class="shop-item-title">${Datainfo.title}</span>
    <img class="shop-item-image" src=${Datainfo.imageUrl}>
    <div class="shop-item-details">
        <span class="shop-item-price">$${Datainfo.price}</span>
        <button class="btn btn-primary shop-item-button" id="p${i}" type="button">ADD TO CART</button>
    </div>
    `
    shopItem.innerHTML=shopItemsContents
    shopItems.append(shopItem)
    document.getElementById(`p${i}`).addEventListener('click',function(){
        addToCart(Datainfo)
    })
    }
    let number=i
   
    updateCartTotal()
    })
    }
    

function purchaseClicked(){
    alert('thank You for your purchase')
    var cartItems=document.getElementsByClassName('cart-items')[0]
    while(cartItems.hasChildNodes()){
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal()
}

function notification(title){
    const container = document.getElementById("main");
    const notif=document.createElement('div');
    notif.classList.add('toast');
    notif.innerText=`Your Product ${title} is added to cart`

     container.appendChild(notif);
       setTimeout(()=>{
       notif.remove();
       },1000)
}

function quantityChanged(event){
    var input=event.target;
    if(isNaN(input.value) || input.value <=0){
        input.value=1
    }
    updateCartTotal()
}

function removeit(productId){
    axios.post("http://localhost:3000/cart-delete-item",{productId:productId})
    .then(response=>{
    console.log(response);
    }).catch(err=>console.log(err))
}

function removeCartItem(event){
    console.log('175');
        var buttonClicked=event.target;
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}




function updateCartTotal(){
var cartItemContainer=document.getElementsByClassName('cart-items')[0];
var cartRows=cartItemContainer.getElementsByClassName('cart-row')
var total=0;
for(var i=0;i<cartRows.length;i++){
    var cartRow=cartRows[i]
    console.log(cartRow);
    var priceElement=cartRow.getElementsByClassName('cart-price')[0];
    var quantityElement=cartRow.getElementsByClassName('cart-quantity-input')[0];
    var price=parseFloat(priceElement.innerText.replace('$',''))   
    var quantity=quantityElement.value;
total=total+(price*quantity)
}
let number=i;

document.getElementsByClassName('number')[0].innerHTML=number

total=Math.round(total*100)/100
document.getElementsByClassName('cart-total-price')[0].innerText='$'+total

}
const orderBtn=document.getElementsByClassName('btn-purchase')[0];


orderBtn.addEventListener('click',()=>{
  axios.post('http://localhost:3000/create-order').then(()=>{
    location.href='order.html';
  }).catch(err=>console.log(err));
})



