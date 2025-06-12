import React from 'react'
import PropTypes from 'prop-types'
/** Styles */
import './CompleteQuiz.css'

const CompleteQuiz = ({ data, isError }) => {
	if (!isError) {
		return (
			<div className="complete-container">
				<h2 className="complete-title">Felicidades</h2>
				<h4 className="complete-subtitle">Completaste este módulo con éxito</h4>
				<h4 className="complete-record">
					Tu calificación fue de <b>{data.complete_quizzes.calification}%</b>
				</h4>
			</div>
		)
	} else {
		return (
			<div className="complete-container">
				<h2 className="complete-title" style={{ color: '#D50000' }}>Lo sentimos</h2>
				<h4 className="complete-subtitle" style={{ color: '#D50000' }}>Perdiste todas tus vidas</h4>
				<h4 className="complete-record" style={{ color: '#D50000' }}>
					<b>Puedes volver a intentar el quiz dentro de 24 horas.</b>
				</h4>
			</div>
		)
	}
}

CompleteQuiz.propTypes = {
	data: PropTypes.object.isRequired,

}

export default CompleteQuiz
