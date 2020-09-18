-- phpMyAdmin SQL Dump
-- version 4.4.15.5
-- http://www.phpmyadmin.net
--
-- Хост: 127.0.0.1:3306
-- Время создания: Сен 18 2020 г., 10:16
-- Версия сервера: 5.5.48
-- Версия PHP: 5.6.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `bitmexbot`
--

-- --------------------------------------------------------

--
-- Структура таблицы `bots_profiles`
--

CREATE TABLE IF NOT EXISTS `bots_profiles` (
  `id` int(11) NOT NULL,
  `server` varchar(127) NOT NULL,
  `api_key_id` varchar(63) NOT NULL,
  `api_key_secret` varchar(255) NOT NULL,
  `session_id` int(11) NOT NULL DEFAULT '1',
  `session_start_price` float(10,1) NOT NULL,
  `last_ping_time` int(11) NOT NULL,
  `price_modifier` float NOT NULL DEFAULT '1.5',
  `price_reserve_value` int(11) NOT NULL DEFAULT '100'
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `bots_profiles`
--

INSERT INTO `bots_profiles` (`id`, `server`, `api_key_id`, `api_key_secret`, `session_id`, `session_start_price`, `last_ping_time`, `price_modifier`, `price_reserve_value`) VALUES
(1, 'testnet.bitmex.com', 'uH1qPyYSoGk0ifdwtrx-2_Rf', 'YC1zSwvWf__pXmoRl1B9GDmLa25N3HYZ4DbwFI12x6HpHm8C', 1, 10000.0, 1600108149, 1.5, 100);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `bots_profiles`
--
ALTER TABLE `bots_profiles`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `bots_profiles`
--
ALTER TABLE `bots_profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
