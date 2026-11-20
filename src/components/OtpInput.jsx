import { useRef } from 'react';

/**
 * Six-box one-time-code entry with auto-advance, paste support and
 * backspace navigation. Value is kept as a plain digit string.
 */
export default function OtpInput({ value = '', onChange, length = 6, id = 'code', label = 'Verification code' }) {
  const refs = useRef([]);

  const focusAt = (index) => {
    const el = refs.current[Math.max(0, Math.min(length - 1, index))];
    if (el) {
      el.focus();
      el.select?.();
    }
  };

  const write = (index, raw) => {
    const digits = raw.replace(/\D/g, '');
    if (!digits) return;
    const chars = value.padEnd(length, ' ').split('');
    for (let i = 0; i < digits.length && index + i < length; i += 1) {
      chars[index + i] = digits[i];
    }
    onChange(chars.join('').replace(/\s/g, '').slice(0, length));
    focusAt(index + digits.length);
  };

  const handleKeyDown = (index) => (event) => {
    if (event.key === 'Backspace') {
      event.preventDefault();
      const chars = value.split('');
      if (chars[index]) {
        chars[index] = '';
        onChange(chars.join(''));
      } else if (index > 0) {
        chars[index - 1] = '';
        onChange(chars.join(''));
        focusAt(index - 1);
      }
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusAt(index - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusAt(index + 1);
    }
  };

  return (
    <div className="otp" role="group" aria-label={label}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            refs.current[index] = el;
          }}
          id={index === 0 ? id : undefined}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          pattern="\d*"
          maxLength={length}
          aria-label={`Digit ${index + 1} of ${length}`}
          value={value[index] || ''}
          onChange={(e) => write(index, e.target.value)}
          onKeyDown={handleKeyDown(index)}
          onPaste={(e) => {
            e.preventDefault();
            write(0, e.clipboardData.getData('text'));
          }}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
}
