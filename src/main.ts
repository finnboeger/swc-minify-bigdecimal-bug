import { BigDecimal } from "bigdecimal";


function component() {
  const b = new BigDecimal.valueOf(0.0);
  const element = document.createElement('div');

  return element;
}

document.body.appendChild(component());
