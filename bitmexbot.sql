-- phpMyAdmin SQL Dump
-- version 4.4.15.5
-- http://www.phpmyadmin.net
--
-- Хост: 127.0.0.1:3306
-- Время создания: Сен 22 2020 г., 21:06
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
(1, '204879c2609b93dfbcee8c4e0877334b', 1, 'testnet.bitmex.com', 'uH1qPyYSoGk0ifdwtrx-2_Rf', 'YC1zSwvWf__pXmoRl1B9GDmLa25N3HYZ4DbwFI12x6HpHm8C', 34, 1, 10000.0, 1600797902, 1600797919, 1.5, 100, 0.020, 0.040, 0.050, 0.060, 0.070, 0.080, 0.100, 0.0300000000);

-- --------------------------------------------------------

--
-- Структура таблицы `bots_trades`
--

CREATE TABLE IF NOT EXISTS `bots_trades` (
  `id` int(11) NOT NULL,
  `bot_id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `trade_id` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `type` varchar(32) NOT NULL DEFAULT '',
  `enter_price` float(10,2) NOT NULL,
  `target_price` float(10,2) NOT NULL,
  `volume` int(11) NOT NULL,
  `enter_order_id` varchar(255) NOT NULL,
  `target_order_id` varchar(255) NOT NULL,
  `enter_order_status` int(11) NOT NULL DEFAULT '0',
  `target_order_status` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `bots_profiles`
--
ALTER TABLE `bots_profiles`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `bots_trades`
--
ALTER TABLE `bots_trades`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `bots_profiles`
--
ALTER TABLE `bots_profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT для таблицы `bots_trades`
--
ALTER TABLE `bots_trades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=31;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
