export class Theme {
  constructor(){
    this.storage = localStorage.getItem('theme');
  }

  init(){
    let getTheme = this.storage;
    if(getTheme === 'on'){
      document.querySelector('html').setAttribute('theme', 'dark');
      document.querySelector('input[name="theme"]').checked = true;    
    }else{
      document.querySelector('html').setAttribute('theme', 'light');
      document.querySelector('input[name="theme"]').checked = false;   
    }

    this.saveTheme();
  }

  saveTheme(){
    let toggleSwitch = document.querySelector('input[name="theme"]');
    toggleSwitch.addEventListener('change', (event) =>{
      if(event.target.checked){
        document.querySelector('html').setAttribute('theme', event.target.value);
        localStorage.setItem('theme', 'on');   
      }else{
        document.querySelector('html').setAttribute('theme', 'light');
        localStorage.setItem('theme', 'off');  
      }        
    });
  }
}