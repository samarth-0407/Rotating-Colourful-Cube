const updateEvent = new Event('update')
const submitEvent = new Event('submit')

class Controls extends Domel {
  inputsSel
  submitSel

  constructor(sel, {
    inputsSel = 'input',
    submitSel = '#submit',
  }={}) {
    super(sel)
    this.inputsSel = inputsSel
    this.submitSel = submitSel
    this.bootstrap()
  }
  bootstrap() {
    const dispatchUpdate = new Delayable(
      this.dispatchUpdate.bind(this)
    )
    const dispatchSubmit = new Delayable(
      this.dispatchSubmit.bind(this)
    )
    for (const el of this.el.querySelectorAll(this.inputsSel)) {
      el.addEventListener('change', ()=>{dispatchUpdate.delay()})
      // el.addEventListener('blur', ()=>{dispatchUpdate.now()})
    }
    this.el.querySelector(this.submitSel).addEventListener(
      'click', ()=>{
	dispatchUpdate.clearMaybe()
	dispatchSubmit.now()
      }
    )
  }
  dispatchUpdate() {
    this.el.dispatchEvent(updateEvent)
  }
  dispatchSubmit() {
    this.el.dispatchEvent(submitEvent)
  }
  get inputs() {
    const Cls = this.constructor
    const entries = []
    for (const el of this.el.querySelectorAll(this.inputsSel)) {
      entries.push([el.name, Cls.getInputValue(el)])
    }
    return Object.fromEntries(entries)
  }

  static getInputValue(el) {
    let message

    if (el.tagName != 'INPUT') {
      message = `${el.tagName} is not an input element.`
      console.error({el, message})
      throw TypeError(message)
    }

    switch (el.type) {
    case 'button'	: return null;

    case 'checkbox'	:
    case 'radio'	: return el.checked;

    case 'color'	: return hexToRgb(el.value);

    case 'datetime-local' :
    case 'date'		: return new Date(el.value).toISOString();

    case 'email'	:
    case 'month'	:
    case 'search'	:
    case 'tel'		:
    case 'text'		:
    case 'time'		:
    case 'url'		:
    case 'week'		: return el.value;

    case 'range'	:
    case 'number'	: return Number(el.value);
    }

    message = `Unknown input type ${el.type}.`
    console.error({el, message})
    throw TypeError(message)
  }
}
