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

  @State() fetchedPrice: number;
  @State() stockUserInput: string;
  @State() stockInputValid = false;

  onUserInput = (event: Event) => {
    this.stockUserInput = (event.target as HTMLInputElement).value;

    if (this.stockUserInput.trim() !== '') {
      this.stockInputValid = true;
    }else {
      this.stockInputValid = false;
    }
  }

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
        <input
          id="stock-symbol"
          ref={(el) => this.stockInput = el }
          value={this.stockUserInput}
          onInput={this.onUserInput}
        />
        <button type="submit" disabled={!this.stockInputValid}>Fetch Data</button>
      </form>,
      <div>
        <p>Price: ${this.fetchedPrice} </p>
        <p>{this.stockUserInput}</p>
      </div>
    ]
  }
}
