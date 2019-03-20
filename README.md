# React Credit Card Validator

> A credit/debit card validator fields for React

## Usage

```js
import CreditCardValidator from 'react-credit-card-validator'

<CreditCardValidator
          onChangeCreditCardValidator={this.onChangeCreditCardValidator}
          boxClassName="container"
          customTextLabels={{
            holderPlaceholder: "Titular do cartão",
            numberPlaceholder: "Número do cartão",
            cardNumberInvalidLabel: 'O número do cartão não é valido',
            expiryMonthInvalidLabel: 'A data de validade é inválida',
            cvvInvalidLabel: 'O código de segurança é inválido',
          }}
          cardTypes={
            [
              { name: '', value: '' },
              { name: 'Master Card', value: 'mastercard' },
              { name: 'Visa', value: 'visa' },
              { name: 'Visa Debit', value: 'visadebit' },
              { name: 'Visa Electron', value: 'visaelectron' },
              { name: 'V Pay', value: 'vpay' },
              { name: 'Maestro', value: 'maestro' },
              { name: 'American Express', value: 'amex' },
            ]
          }
        />
```