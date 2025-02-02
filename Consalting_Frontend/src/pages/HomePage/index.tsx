import { Container, Row } from "reactstrap";
import { motion } from "framer-motion";

const HomePage = () => {
	return (
		<div className="guest-page">
			<div className="background-overlay" />
			<Container className="content-wrapper">
				<Row>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<h1 className="mb-4">Консалтинг по информационной безопасности</h1>
						<p className="fs-5">Мы предлагаем комплексные услуги по защите вашего бизнеса от киберугроз и обеспечению надёжности ваших IT-решений. Наши эксперты помогают организациям минимизировать риски, повысить устойчивость к атакам и соответствовать современным стандартам безопасности.</p>
					</motion.div>
				</Row>
			</Container>
		</div>
	)
}

export default HomePage