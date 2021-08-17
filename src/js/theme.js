export class Theme {
  constructor(){
    this.storage = localStorage.getItem('theme');
  }

  init(){
    let getTheme = this.storage;
    if(getTheme === 'on'){
        document.body.setAttribute('theme', 'dark');
        document.querySelector('input[name="theme"]').checked = true;    
    }else{
      document.body.setAttribute('theme', '');
      document.querySelector('input[name="theme"]').checked = false;   
    }

    this.saveTheme();
  }

  saveTheme(){
    let toggleSwitch = document.querySelector('input[name="theme"]');
    toggleSwitch.addEventListener('change', (event) =>{
      if(event.target.checked){
        document.body.setAttribute('theme', event.target.value);
        localStorage.setItem('theme', 'on');   
      }else{
        document.body.setAttribute('theme', '');
        localStorage.setItem('theme', 'off');  
      }        
    });
  }
}