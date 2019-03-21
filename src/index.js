import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import payment from 'payment';

class CreditCardValidator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      holder: '',
      cardNumber: '',
      cardType: '',
      brand: '',
      expiry_month: '',
      expiry_year: '',
      expiry: '',
      cvv: '',
      errors: this.props.errors,
    };

    this.onChangeHolder = this.onChangeHolder.bind(this);
    this.onChangeCardNumber = this.onChangeCardNumber.bind(this);
    this.onBlurCardNumber = this.onBlurCardNumber.bind(this);
    this.selectBrand = this.selectBrand.bind(this);
    this.onChangeExpiry = this.onChangeExpiry.bind(this);
    this.onChangeCvv = this.onChangeCvv.bind(this);
    this.validateCvv = this.validateCvv.bind(this);
    this.validateExpity = this.validateExpity.bind(this);
    this.onChangeCreditCardValidator = this.onChangeCreditCardValidator.bind(this);
  }

  onChangeHolder(e) {
    const { errors } = this.state;
    const key = 'holder';
    delete errors[key];
    this.setState({
      holder: e.target.value,
      errors,
    }, () => {
      this.onChangeCreditCardValidator();
    });
  }

  onChangeCardNumber(e) {
    this.checkIsNumeric(e);
    this.setState({
      cardNumber: e.target.value,
    }, () => {
      this.onChangeCreditCardValidator();
    });
    payment.formatCardNumber(document.querySelector('[name=number]'));
    // this.props.onChangeHolder(e.target.value);
  }

  onBlurCardNumber(e) {
    const cardType = payment.fns.cardType(e.target.value) ? payment.fns.cardType(e.target.value) : '';
    const validCard = payment.fns.validateCardNumber(e.target.value);
    const { errors, brand } = this.state;
    payment.formatCardNumber(document.querySelector('[name=number]'));
    const search = brand.includes(cardType);

    if (!cardType || !validCard) {
      errors.cardNumber = this.props.customTextLabels.cardNumberInvalidLabel || 'The card number is not valid';
      this.setState({
        brand: '',
        errors,
      }, () => {
        this.onChangeCreditCardValidator();
      });
    } else {
      const key = 'cardNumber';
      delete errors[key];

      if (!search) {
        this.setState({
          brand: cardType,
          errors,
        }, () => {
          this.onChangeCreditCardValidator();
        });
      } else {
        this.setState({
          errors,
        }, () => {
          this.onChangeCreditCardValidator();
        });
      }
    }
  }

  selectBrand(e) {
    this.setState({
      brand: e.target.value,
    }, () => {
      this.onChangeCreditCardValidator();
    });
  }

  onChangeExpiry(e) {
    this.setState({
      [e.target.name]: e.target.value,
      expiry: '',
    }, () => {
      this.onChangeCreditCardValidator();
    });

    this.validateExpity({ [e.target.name]: e.target.value });
  }

  onChangeCvv(e) {
    this.setState({
      cvv: e.target.value,
    }, () => {
      this.onChangeCreditCardValidator();
    });

    this.validateCvv(e.target.value);
  }

  validateCvv(cvv) {
    const cvvValid = payment.fns.validateCardCVC(cvv);
    const { errors } = this.state;

    if (!cvvValid) {
      errors.cvv = this.props.customTextLabels.cvvInvalidLabel || 'The security code is invalid';
      this.setState({
        errors,
      }, () => {
        this.onChangeCreditCardValidator();
      });
    } else {
      const key = 'cvv';
      delete errors[key];

      this.setState({
        errors,
      }, () => {
        this.onChangeCreditCardValidator();
      });
    }

  }

  validateExpity(o) {
    const expiry_month = o.expiry_month ? o.expiry_month : this.state.expiry_month;
    const expiry_year = o.expiry_year ? o.expiry_year : this.state.expiry_year;
    const expityValid = payment.fns.validateCardExpiry(expiry_month, expiry_year);
    const { errors } = this.state;

    if (expiry_month && expiry_year) {
      if (!expityValid) {
        errors.expiry_month = this.props.customTextLabels.expiryMonthInvalidLabel || 'The expiration date is invalid';
        this.setState({
          errors,
        }, () => {
          this.onChangeCreditCardValidator();
        });
      } else {
        const key = 'expiry_month';
        delete errors[key];

        this.setState({
          errors,
        }, () => {
          this.onChangeCreditCardValidator();
        });
      }
    }
  }

  checkIsNumeric(e) {
    if (!/^\d*$/.test(e.key)) {
      e.preventDefault();
    }
  };

  onChangeCreditCardValidator() {
    const { state } = this;
    this.props.onChangeCreditCardValidator({ ...state });
  }

  render() {
    const {
      customTextLabels,
      showCardType,
    } = this.props;

    const { errors } = this.state;

    const box = {
      padding: '25px',
      backgroundColor: '#f6f9f9',
      display: 'inline-block',
    };

    const inputStyle = {
      height: '32px',
      width: '100%',
      backgroundColor: '#FFFFFF',
      border: '2px solid #D0D6DD',
      borderRadius: '3px',
      boxShadow: 'none',
      fontSize: '15px',
      color: '#455C75',
      letterSpacing: '-0.31px',
      lineHeight: '24px',
      padding: '0 10px',
      resize: 'none',
      boxSizing: 'border-box',
    }

    const inputStyleError = {
      height: '32px',
      width: '100%',
      backgroundColor: '#FFFFFF',
      border: '2px solid red',
      borderRadius: '3px',
      boxShadow: 'none',
      fontSize: '15px',
      color: '#455C75',
      letterSpacing: '-0.31px',
      lineHeight: '24px',
      padding: '0 10px',
      resize: 'none',
      boxSizing: 'border-box',
    }

    const renderMonths = () => {
      const rangeMonths = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
      return rangeMonths.map((month) => (<option key={month} value={month}>{month}</option>));
    }

    const renderYears = () => {
      const start = new Date().getFullYear();
      const stop = start + 15;
      const rangeYears = _.range([start], stop, 1);
      return rangeYears.map((year) => (<option key={year} value={year}>{year}</option>));
    }

    const renderCardTypes = () => {
      const { cardTypes } = this.props;

      return cardTypes.map((card) => {
        const { brand } = this.state;
        let search = true;
        if (this.state.cardNumber) {
          search = card.value.includes(brand);
        }

        return (<option key={card.value} value={card.value} disabled={!search}>{card.name}</option>)
      });
    }

    return (
      <div style={box} className={this.props.boxClassName}>
        <div
          style={{
            paddingBottom: '15px',
            boxSizing: 'border-box',
          }}
        >
          <input
            name="holder"
            value={this.state.holder}
            style={errors.holder ? inputStyleError : inputStyle}
            placeholder={customTextLabels.holderPlaceholder || 'Card holder name'}
            onChange={this.onChangeHolder}
          />
        </div>
        {showCardType && (
          <div
            style={{
              paddingBottom: '15px',
              boxSizing: 'border-box',
            }}
          >
            <select
              name="brand"
              value={this.state.brand}
              onChange={this.selectBrand}
              style={inputStyle}
            >
              {renderCardTypes()}
            </select>
          </div>
        )}
        <div
          style={{
            width: '50%',
            float: 'left',
            boxSizing: 'border-box',
            paddingRight: '15px',
          }}
        >
          <input
            name="number"
            value={this.state.cardNumber}
            style={errors.cardNumber ? inputStyleError : inputStyle}
            placeholder={customTextLabels.numberPlaceholder || 'Card number'}
            onChange={this.onChangeCardNumber}
            onKeyPress={this.onChangeCardNumber}
            onBlur={this.onBlurCardNumber}
          />
          {!_.isEmpty(errors) && (
            <div style={{ color: 'red', fontSize: '12px', padding: '5px' }}>{errors.holder || errors.cardNumber || errors.expiry_month || errors.cvv}</div>
          )}
        </div>
        <div
          style={{
            width: '15%',
            float: 'left',
            boxSizing: 'border-box',
            paddingRight: '15px',
          }}
        >
          <select
            name="expiry_month"
            value={this.state.expiry_month}
            style={errors.expiry_month ? inputStyleError : inputStyle}
            onChange={this.onChangeExpiry}
          >
            <option value=''>{customTextLabels.monthPlaceholder || 'MM'}</option>
            {renderMonths()}
          </select>
        </div>
        <div
          style={{
            width: '20%',
            float: 'left',
            boxSizing: 'border-box',
            paddingRight: '15px',
          }}
        >
          <select
            name="expiry_year"
            value={this.state.expiry_year}
            style={errors.expiry_month ? inputStyleError : inputStyle}
            onChange={this.onChangeExpiry}
          >
            <option value=''>{customTextLabels.yearPlaceholder || 'YYYY'}</option>
            {renderYears()}
          </select>
        </div>
        <div
          style={{
            width: '15%',
            float: 'left',
            boxSizing: 'border-box',
          }}
        >
          <input
            name="cvv"
            value={this.state.cvv}
            style={errors.cvv ? inputStyleError : inputStyle}
            placeholder={customTextLabels.cvvPlaceholder || 'CVV'}
            onChange={this.onChangeCvv}
          />
        </div>
      </div>
    );
  }
}

export default CreditCardValidator;

CreditCardValidator.propTypes = {
  holder: PropTypes.string,
  number: PropTypes.string,
  expiry_month: PropTypes.string,
  expiry_year: PropTypes.string,
  cvv: PropTypes.string,
  customTextLabels: PropTypes.shape({
    holderPlaceholder: PropTypes.string,
    numberPlaceholder: PropTypes.string,
    cvvPlaceholder: PropTypes.string,
    yearPlaceholder: PropTypes.string,
    monthPlaceholder: PropTypes.string,
  }),
  onChangeCreditCardValidator: PropTypes.func.isRequired,
};

CreditCardValidator.defaultProps = {
  cardTypes: [
    { name: 'Master Card', value: 'mastercard' },
    { name: 'Visa', value: 'visa' },
    { name: 'Visa Debit', value: 'visadebit' },
    { name: 'Visa Electron', value: 'visaelectron' },
    { name: 'V Pay', value: 'vpay' },
    { name: 'Maestro', value: 'maestro' },
    { name: 'American Express', value: 'amex' },
    { name: 'Discove', value: 'discover' },
    { name: 'JCB', value: 'jcb' },
    { name: 'Diners Club', value: 'dinersclub' },
    { name: 'Laser', value: 'laser' },
    { name: 'UnionPay', value: 'unionpay' },
    { name: 'Elo', value: 'elo' },
    { name: 'Hipercard', value: 'hipercard' },
  ],
  errors: {},
  showCardType: true,
}