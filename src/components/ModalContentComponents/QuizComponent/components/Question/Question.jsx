import React from 'react'
import PropTypes from 'prop-types'

const Question = ({ question, image }) => (
	<React.Fragment>
		<img src="/images/logo.svg" alt="Logo" width={250} />
		<h2>{question}</h2>
		{image && <img src={image} alt="Image Question" />}
	</React.Fragment>
)

Question.propTypes = {
	question: PropTypes.string.isRequired,
	image: PropTypes.string,
}

export default Question
