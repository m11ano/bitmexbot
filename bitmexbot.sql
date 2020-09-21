-- phpMyAdmin SQL Dump
-- version 4.4.15.5
-- http://www.phpmyadmin.net
--
-- Хост: 127.0.0.1:3306
-- Время создания: Сен 21 2020 г., 14:29
-- Версия сервера: 5.5.48
-- Версия PHP: 7.0.4

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
  `secret_seed` varchar(32) NOT NULL,
  `status` int(11) NOT NULL,
  `server` varchar(127) NOT NULL,
  `api_key_id` varchar(63) NOT NULL,
  `api_key_secret` varchar(255) NOT NULL,
  `session_id` int(11) NOT NULL DEFAULT '1',
  `session_init` int(11) NOT NULL,
  `session_start_price` float(10,1) NOT NULL,
  `session_start_time` int(11) NOT NULL,
  `last_ping_time` int(11) NOT NULL,
  `price_modifier` float NOT NULL DEFAULT '1.5',
  `price_reserve_value` int(11) NOT NULL DEFAULT '100',
  `main_pos_cof_x100` float(10,3) NOT NULL,
  `main_pos_cof_x50` float(10,3) NOT NULL,
  `main_pos_cof_x25` float(10,3) NOT NULL,
  `main_pos_cof_x10` float(10,3) NOT NULL,
  `main_pos_cof_x5` float(10,3) NOT NULL,
  `main_pos_cof_x3` float(10,3) NOT NULL,
  `main_pos_cof_x2` float(10,3) NOT NULL,
  `max_amount` double(10,10) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `bots_profiles`
--

INSERT INTO `bots_profiles` (`id`, `secret_seed`, `status`, `server`, `api_key_id`, `api_key_secret`, `session_id`, `session_init`, `session_start_price`, `session_start_time`, `last_ping_time`, `price_modifier`, `price_reserve_value`, `main_pos_cof_x100`, `main_pos_cof_x50`, `main_pos_cof_x25`, `main_pos_cof_x10`, `main_pos_cof_x5`, `main_pos_cof_x3`, `main_pos_cof_x2`, `max_amount`) VALUES
(1, '204879c2609b93dfbcee8c4e0877334b', 1, 'testnet.bitmex.com', 'uH1qPyYSoGk0ifdwtrx-2_Rf', 'YC1zSwvWf__pXmoRl1B9GDmLa25N3HYZ4DbwFI12x6HpHm8C', 24, 0, 10500.0, 1600635944, 0, 1.5, 50, 0.002, 0.004, 0.005, 0.006, 0.007, 0.008, 0.010, 0.0200000000);

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
