export class Elem {
  private _elem: HTMLElement
  private _name: string
  constructor(type: keyof HTMLElementTagNameMap) {
    this._elem = document.createElement(type)
  }

  appendTo(parent: HTMLElement) {
    parent.appendChild(this._elem)
  }

  get elem() {
    return this._elem
  }

  get name() {
    return this._name
  }

  set name(newName: string) {
    console.log(`Setting name=${this._name} to name=${newName}`)

    this._name = newName
    this._elem.textContent = newName
  }
}

