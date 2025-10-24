import React from 'react'

// Simple IconButton used across the app.
// Props: onClick, title, color (string), size (number), children (icon svg)
export default function IconButton({onClick, title, color = '#333', size = 18, children, style}){
	const base = {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: size + 15,
		height: size + 15,
		padding: 6,
		borderRadius: 6,
		border: 'none',
		background: 'transparent',
		cursor: 'pointer',
	}
	const iconStyle = { width: size, height: size, color }
	return (
		<button onClick={onClick} title={title} style={{...base, ...style}} aria-label={title}>
			{children ? React.cloneElement(children, {width: size, height: size, stroke: color, fill: 'none', style: iconStyle}) : null}
		</button>
	)
}
