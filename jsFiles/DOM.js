
    document.body.onload=()=>{
        setup()
        setTimeout(()=>{
            document.body.style.visibility='visible'
        },1000)
    }

    let isLoading = false;
    const loadMorePosts=document.querySelector('.loadMorePosts');
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading) {
            fillPostsInHtml()
        }
    }, {
        root: null, 
        rootMargin:'300px',
        threshold: 1.0   
    });
    observer.observe(loadMorePosts);

async function fillPostsInHtml(){
    isLoading=true;
    let response;
    try{
       response= await getPosts(); 
    }catch(error){
        isLoading=false;
        showAlert(error,"danger");
        return;
    }
    
    let postsElement =document.querySelector('.posts');
    
    if (!response){
        isLoading=false;
        return
    };
    response.forEach(element => {
        
        let content =
         `
             <!--post-->

               <div class="card shadow my-3">
                    <div class="card-header d-flex justify-conten-center align-items-center">
                        <img  class="rounded-circle border p-1" src="${element.author.profile_image || "./images/userPictur.jpg"} " alt="user pictur">
                        <h5 class="author my-auto mx-1">@${element.author.username}</h5>
                    </div>
                    <div class="card-body">
                        <img class="PostImage my-2 rounded border-2 mx-auto" src="${element.image} " alt="">
                        <div class="text-muted my-1">${element.created_at}</div>
                        <h5 class="card-title">${element.title|| " (no title) "}</h5>
                        <p class="card-text"> ${element.body}</p>
                        <hr>
                        <div class="d-flex flex-wrap flex-row">
                            <h6 class="commentElement px-2 py-1">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                    </svg>
                                </span> (${element.comments_count}) comments
                            </h6>
                            <div id="postTags${element.id}" class="postTags d-flex">
                                
                            </div>
                        </div>
                    </div>
                </div> 
            <!--// post //-->  
         `;
        
        postsElement.innerHTML+=content;

        // add tags 
        let postTags =document.getElementById(`postTags${element.id}`);
        for (let tag of element.tags) {
            let oneTag=
            `
                <div class="Tag mx-1 px-2 py-1 rounded-pill "> ${tag.name} </div>
            `
            postTags.innerHTML+=oneTag;
        }
        
    });
    isLoading=false;

}
    // LOGIN USER
    async function loginUserUI(){
        const username =document.querySelector('.usernameInput').value;
        const password =document.querySelector('.passwordInput').value;
        let response;
        try{
            response = await LoginUser(username,password);

        }catch(error){
            showAlert(error,'danger');
            return;
        }
        let token = response.token;
        localStorage.setItem('token',token);
        localStorage.setItem('userInformation',JSON.stringify(response.user));
        // CLOSE MODLE OF LOGIN 
        const exampleModal= document.getElementById('loginModal');
        const instance = bootstrap.Modal.getOrCreateInstance(exampleModal);
        instance.hide();
        showAlert('login is seccessefully','success')
        setup()
    }



        // REGISTER NEW USER
    async function registerNewUserUI(){
        const name =document.querySelector('.registerNameInput').value;
        const username =document.querySelector('.registerUsernameInput').value;
        const password =document.querySelector('.registerPasswordInput').value;
        const registerPicturUser =document.querySelector('.registerPicturUser').files[0];
        // todo : fix function prams
        let formdata= new FormData()
        formdata.append('name',name)
        formdata.append('username',username)
        formdata.append('password',password)
        formdata.append('image',registerPicturUser)

        let response ;
        try{
            response = await registerNewUser(formdata);
        }catch(error){
            showAlert(error,'danger');
            return ;
        }
         
        let token = response.token;
        localStorage.setItem('token',token);
        localStorage.setItem('userInformation',JSON.stringify(response.user));
        // CLOSE MODLE OF LOGIN 
        const exampleModal= document.getElementById('registerModal');
        const instance = bootstrap.Modal.getOrCreateInstance(exampleModal);
        instance.hide();

        showAlert('login is seccessefully','success')
        setup()
    }



    // logout
    function logoutuser(){
        localStorage.removeItem('token');
        const profileNavBar=document.getElementById('profileNavBar');
        profileNavBar.innerHTML=""
        showAlert('logout is seccessefully','warning')
        setup();
    }
    // SHOW AND HIDE BUTTON AFTER LOGIN OR ELSE
    function setup (){
        let token =localStorage.getItem('token');
        let  user = JSON.parse(localStorage.getItem('userInformation'));
        const logout_btn=document.querySelector('#logout_btn');
        const login_btn = document.querySelector('#login_btn');
        const addPost_btn=document.querySelector('.addPost_btn')
        const regester_btn = document.querySelector('#regester_btn');
        if(token!=null && user!=null){
            logout_btn.classList.remove('hideEllement');
            login_btn.classList.add('hideEllement');
            regester_btn.classList.add('hideEllement');
            addPost_btn.classList.remove('hideEllement');
            fillProfileInformation();
            

        }else{
            login_btn.classList.remove('hideEllement');
            regester_btn.classList.remove('hideEllement');
            logout_btn.classList.add('hideEllement');
            addPost_btn.classList.add('hideEllement');

        }
    }

    function fillProfileInformation(){
        const profileNavBar=document.getElementById('profileNavBar');
        let  user = JSON.parse(localStorage.getItem('userInformation'));
        if(user == null){
            return;
        }
        const imageSrc = user.profile_image || "./images/userPictur.jpg";
        let element = 
        `
            <img class="rounded-circle border-3" width="40px" height="40px" src="${imageSrc} " alt="user pictur">
            <span id="userNameNavBar" class="user mx-1 text-truncate" style="width:clamp(60px, 20vw, 150px)" >@${user.username} </span>
        `
        profileNavBar.innerHTML=element;
    }


    // create new post 
    async function createNewPostUI() {
        const postTitle=document.getElementById('postTitle').value.trim();
        const bodyPost=document.getElementById('bodyPost').value.trim();
        const postPictor=document.getElementById('postPictor').files[0];
        if (!postTitle) {
            showAlert('please fill in the title', 'danger');
            return;
        }
        let formdata= new FormData()
        formdata.append('title',postTitle)
        formdata.append('body',bodyPost)        
        formdata.append('image',postPictor)
        let response=""
        try{ 
            response =await createNewPost(formdata);
        }catch(error){      
        showAlert(error,'danger')
        return;
        }
        const exampleModal= document.getElementById('createPostModal');
        const instance = bootstrap.Modal.getOrCreateInstance(exampleModal);
        instance.hide();
        
        showAlert("the new post has been create seccessefully",'success');



}



    //  show alert function
    function showAlert(alertmessage,alerType){
        const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
        const appendAlert = (message, type) => {
            const wrapper = document.createElement('div')
            wrapper.innerHTML = [
                `<div class="alert alert-${type} alert-dismissible show fade" role="alert">`,
                `   <div>${message}</div>`,
                '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                '</div>'
            ].join('');
            alertPlaceholder.append(wrapper);
            return wrapper.firstElementChild; 
        }
        const alertEl = appendAlert(alertmessage, alerType);

        setTimeout(() => {
            const alert = new bootstrap.Alert(alertEl) ;
            alert.close()
        }, 2500);
        
    }
    