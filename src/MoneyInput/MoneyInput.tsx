import React, { useRef, useState, ChangeEvent, FocusEvent } from 'react'
import _styles from './MoneyInput.module.css'

interface MoneyInputProps {
  locale: string
  label: string
  disabled: boolean
}

const convertToCents = (value: string): number => {
  const numericValue = parseFloat(value.replace(/[^\d.]/g, ''))
  return Math.round(numericValue * 100)
}

const MoneyInput: React.FC<MoneyInputProps> = ({ locale, label, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = useState<string>('')
  const [rawValue, setRawValue] = useState<string>('')
  const [isValid, setIsValid] = useState(true)

  const formatToCurrency = (value: string) => {
    const numericalValue = parseFloat(value)
    if (isNaN(numericalValue)) return ''

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
    }).format(numericalValue)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const generalRegex = /^[\d.,€$£\s]+$/

    const isValueValid = generalRegex.test(value)

    setIsValid(isValueValid)

    const numericalValue = value.replace(/[^\d]/g, '')

    if (numericalValue === '') {
      setRawValue('')
      setInputValue('')
      return
    }

    setRawValue(numericalValue)
    const formattedValue = formatToCurrency((parseInt(numericalValue) / 100).toString())
    setInputValue(formattedValue)
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>): void => {
    if (!e.target.value) return

    const intValue = convertToCents(e.target.value)
    console.log(` ${intValue}`)

    e.target.value = intValue.toString()
  }

  const handleFocus = (e: FocusEvent<HTMLInputElement>): void => {
    if (inputRef.current) {
      const formattedValue = formatToCurrency((parseInt(rawValue) / 100).toString())
      inputRef.current.value = formattedValue
    }
  }
  console.log(isValid)
  return (
    <form className={_styles.container}>
      <label htmlFor="moneyInput" className={_styles.labelInput}>
        {label}
      </label>
      {disabled ? (
        <input value={inputValue} type="text" className={_styles.fieldDisabledInput} id="moneyInput" readOnly />
      ) : (
        <input
          ref={inputRef}
          type="text"
          className={`${_styles.fieldInput} ${!isValid ? _styles.invalid : ''}`}
          id="moneyInput"
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          value={inputValue}
        />
      )}
    </form>
  )
}

export default MoneyInput
