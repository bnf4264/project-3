const template = document.createElement("template");
template.innerHTML = `
<style>
:host{
    display: block;
    background-color: white;
}
span{
    color: #808080;
    font-weight: bolder;
}
</style>
<span></span>
</style>
`;

class AppFooter extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback(){
        this.render();
    }

    render(){
        const contact = this.getAttribute('data-contact') ? this.getAttribute('data-contact') : "bnf4264@rit.edu, spl7789@rit.edu";

        this.shadowRoot.querySelector("span").innerHTML = `Contact: ${contact}`;
    }
}

customElements.define('app-footer', AppFooter);