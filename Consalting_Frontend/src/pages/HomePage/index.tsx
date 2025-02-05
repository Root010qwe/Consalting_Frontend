import { FC, useEffect } from "react";
import { motion } from "framer-motion";
import video from "../../assets/3.mp4";
import "./HomePage.css";

const HomePage: FC = () => {
	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "auto";
		};
	}, []);

	return (
		<div className="home">
			<video className="background-video" autoPlay loop muted>
				<source src={video} type="video/mp4" />
				Ваш браузер не поддерживает видео.
			</video>
			<div className="overlay"></div>
			<div className="content-wrapper">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="content-inner"
				>
					<h1>Консалтинг по информационной безопасности</h1>
					<p>
						Добро пожаловать в мир кибербезопасности! Мы предлагаем комплексные 
						решения для защиты вашего бизнеса. Наши эксперты помогают минимизировать 
						риски, адаптировать системы безопасности и обеспечить соответствие 
						современным стандартам. Доверьте защиту вашей информации профессионалам и 
						почувствуйте уверенность в завтрашнем дне.
					</p>
				</motion.div>
			</div>

		</div>
	);
};

export default HomePage;