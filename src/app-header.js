const template = document.createElement("template");
template.innerHTML = `
<style>
:host{
    display: block;
}
p{
    color: black;
    text-align: center;
}
</style>
<p></p>
</style>
`;

class AppHeader extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback(){
        this.render();
    }

    render(){
        const title = this.getAttribute('data-title') ? this.getAttribute('data-title') : "AimTrain";

        this.shadowRoot.querySelector("p").innerHTML = title;
    }
}

customElements.define('app-header', AppHeader);