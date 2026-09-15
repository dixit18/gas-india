import React from 'react';
export const card = 'rounded-3xl border bg-[hsl(var(--card))] p-5 shadow-sm';
export const btn = 'min-h-[44px] inline-flex items-center justify-center rounded-2xl px-5 font-semibold text-white bg-[hsl(var(--primary))] active:scale-[0.98]';
export function Card(props) { return <div {...props} className={card + ' ' + (props.className || '')} />; }
export function Btn(props) { return <button {...props} className={btn + ' ' + (props.className || '')} />; }
