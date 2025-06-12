import React from 'react'
import PropTypes from 'prop-types'
/** Styles */
import './Options.css'

const Options = ({
	multiple,
	options,
	responses,
	onSelectedOption,
	button_message,
	onSentQuiz
}) => (
	<React.Fragment>
		{multiple && (
			<h2 className="text-white font-normal">
				Puedes seleccionar mas de 1 respuesta
			</h2>
		)}
		<div className="option-container">
			{options.map((item, key) => (
				<React.Fragment key={key}>
					{multiple ? (
						<div
							className="checkbox-container"
							onClick={() => onSelectedOption(item.response)}>
							<div className="checkbox">
								{responses.includes(item.response) && (
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="#379531"
										stroke-width="4">
										<polyline points="20 6 9 17 4 12" />
									</svg>
								)}
							</div>
							<p>{item.option}</p>
						</div>
					) : (
						<div
							className="option-container"
							style={{ flexDirection: 'row' }}
							onClick={() => onSelectedOption(item.option)}>
							<div className="radio">
								{responses === item.option && (
									<div className="radio-center" />
								)}
							</div>
							<label style={{ width: 'calc(100% - 30px)' }}>{item.option}</label>
						</div>
					)}
				</React.Fragment>
			))}
		</div>
		<div
			className={`button-container ${
				responses.length > 0 ? 'opacity-[1]' : 'opacity-0'
			}`}
			onClick={onSentQuiz}>
			<button>{button_message}</button>
		</div>
	</React.Fragment>
)

Options.propTypes = {
	multiple: PropTypes.bool,
	options: PropTypes.array.isRequired,
	onSelectedOption: PropTypes.func.isRequired,
	responses: PropTypes.string.isRequired,
	button_message: PropTypes.string.isRequired,
	onSentQuiz: PropTypes.func.isRequired
}

export default Options
