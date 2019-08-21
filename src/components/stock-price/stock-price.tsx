import { Component, State, Element, h } from '@stencil/core'

import {AV_API_KEY} from './../../global/global'

@Component({
  tag: 'uc-stock-price',
  styleUrl: 'stock-price.css',
  shadow: true
})

export class StockPrice {
  stockInput: HTMLInputElement;

  @Element() el: HTMLElement;

  @State() fetchedPrice: number

  onFetchStockPrice = (e: Event) => {
    e.preventDefault();
    // console.log(this.el);
    // const stockSymbol = (this.el.shadowRoot.querySelector('#stock-symbol') as HTMLInputElement).value;
    const stockSymbol = this.stockInput.value;

    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`)
    .then((res) => {
      return res.json();
    })
    .then(parsedRes => {
      console.log(parsedRes);
      this.fetchedPrice = +parsedRes['Global Quote']['05. price']
      console.log(this.fetchedPrice);
    })
    .catch(err => {
      console.log(err);
    })
  }

  render() {
    return [
      <form onSubmit={this.onFetchStockPrice}>
        <input id="stock-symbol" type="text" ref={(el) => this.stockInput = el } />
        <button type="submit">Fetch Data</button>
      </form>,
      <div>
        <p>Price: ${this.fetchedPrice} </p>
      </div>
    ]
  }
}
