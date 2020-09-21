<?php

/*
	Класс для работы с БД
*/

class Database {
	
	var $exception = false;
	
	//Инициализировать БД
	public function initDatabase($basehost, $basename, $baseuser, $basepass, $prefix)
	{
		$this->prefix = $prefix;
		$this->mysqli = new mysqli($basehost, $baseuser, $basepass, $basename);
		$this->query_log = array();
		if (mysqli_connect_errno($this->mysqli)) {
			echo "Не удалось подключиться к MySQL: " . mysqli_connect_error();
		}
		$this->mysqli->query('SET NAMES `utf8mb4`');
	}
	
	//Отправить запрос к БД
	public function query($query)
	{
		$this->query_log[] = $query;
		if ($result = $this->mysqli->query($query))
		{
			if (isset($result->num_rows))
			{
				$this->num_rows = $result->num_rows;
			}
			else
			{
				$this->num_rows = 0;
			}
			return $result;
		}
		else
		{
			if ($this->exception == true)
			{
				throw new Exception($this->mysqli->error);
			}
			else
			{
				exit('Query '.$query.' genereated this: '.$this->mysqli->error);
			}
		}
	}
	
	//Функция вставки
	function insert(Array $insert)
	{
		if (!isset($insert['table']) || !isset($insert['fields']))
		{
			die('Неправильная структура массива');
		}
		else
		{
			$fieldlist = array();
			foreach ($insert['fields'] as $key=>$value)
			{
				$fieldlist[] = '`'.$this->escape($key).'`';
				if($value === null)
				{
					$insert['fields'][$key] = 'NULL';
				}
				else
				{
					$insert['fields'][$key] = 'CONCAT(\''.$this->escape($value).'\')';
				}
			}
			$r = $this->query('INSERT INTO `'.$this->prefix.$insert['table'].'` ( '.implode(',' , $fieldlist).') VALUES( '.implode(',' , array_values($insert['fields'])).')');
			return $this->insert_id();
		}
	}

	//Функция обновить
	function update(Array $update)
	{
		if (!isset($update['table']) || !isset($update['fields']))
		{
			die('Неправильная структура массива');
		}
		if (!isset($update['where']))
		{
			$update['where'] = '';
		}
		$fieldlist = array();
		foreach ($update['fields'] as $key=>$value)
		{
			$fieldlist[] = '`'.$key.'`'.'=\''.$this->escape($value).'\'';
		}
		$changes = implode(',' , $fieldlist);
		$this->query('UPDATE `'.$this->prefix.$update['table'].'` m set '.$changes.' '.((strlen($update['where']) > 0) ? 'WHERE '.$update['where'] : ''));
	}


	//Функция обновить по ID
	function updateById($update)
	{
		if (isset($update['id']))
		{
			$update['where'] = 'id='.intval($update['id']);
			$this->update($update);
		}
	}
	
	//Функция удалить
	function delete($delete)
	{
		if (!isset($delete['table']))
		{
			die('Неправильная структура массива');
		}
		$this->query('DELETE from `'.$this->prefix.$delete['table'].'` '.(isset($delete['where']) && strlen($delete['where']) > 0 ? 'WHERE '.$delete['where'] : '').' '.(isset($delete['limit']) && is_array($delete['limit']) ? 'LIMIT '.implode(',', $delete['limit']) : ''));
	}
	
	//Функция удалить по ID
	function deleteById($delete)
	{
		if (isset($delete['id']))
		{
			$delete['where'] = 'id='.intval($delete['id']);
			$this->delete($delete);
		}
	}

	//Функция инкремента по ID
	function incr($incr)
	{
		$this->query('UPDATE `'.$this->prefix.$incr['table'].'` m SET m.'.$incr['field'].'=m.'.$incr['field'].'+'.(isset($incr['value']) ? $incr['value'] : '1').' WHERE m.id='.$incr['id']);
	}
	
	//Функция инкремента по множеству ID
	function incr_by_ids($incr)
	{
		$this->query('UPDATE `'.$this->prefix.$incr['table'].'` m SET m.'.$incr['field'].'=m.'.$incr['field'].'+'.(isset($incr['value']) ? $incr['value'] : '1').' WHERE m.id IN ('.implode(',',$incr['ids']).')');
	}

	//Функция дикремента

	function dincr($dincr)
	{
		$this->query('UPDATE `'.$this->prefix.$dincr['table'].'` m SET m.'.$dincr['field'].'=m.'.$dincr['field'].'-'.(isset($dincr['value']) ? $dincr['value'] : '1').' WHERE m.id='.$dincr['id']);
	}
	
	//Подготовить массив для выборки
	function prepareSelect(Array $select)
	{
		$default = array(
			'what' => 'm.*',
			'where' => '',
			'sort' => '',
			'limit' => false,
			'join' => false,
			'join_manual' => false,
			'groupby' => false,
			'alias' => 'm',
		);
		$result = array();
		foreach($default as $key=>$value)
		{
			if (!isset($select[$key]))
			{
				$result[$key] = $value;
			}
		}
		return array_merge($result, $select);
	}
	
	//Функция выборки
	function select(Array $select, $func = false){
		
		if (!isset($select['table']))
		{
			die('Не указана таблица для выборки');
		}
		else
		{
			$table = $select['table'];
		}
			
		$select = $this->prepareSelect($select);
		$what = $select['what'];
			
		if (strlen($select['where']) == 0)
		{
			$where_q = '';
		}
		else
		{
			$where_q = 'WHERE '.$select['where'].' ';
		}
		
		if (strlen($select['groupby']) == 0)
		{
			$groupby_q = '';
		}
		else
		{
			$groupby_q = 'GROUP BY '.$select['groupby'].' ';
		}
		
		if (!isset($select['alias']))
		{
			$select['alias'] = 'm';
		}
			
		if ($select['limit'])
		{
			if(is_array($select['limit'])){
				$limit_q = 'LIMIT '.implode(',' , $select['limit']).' ';
			}
			else{
				throw new Exception('Limit должен быть массивом');
			}
		}
		else
		{
			$limit_q = '';
		}
		
		if (!is_array($select['sort']) || count($select['sort']) == 0)
		{
			$sort_q = '';
		}
		else
		{
			$sort_q = ' ORDER BY '.implode(',' , $select['sort']).' ';
		}
			
		if ($select['join'] == false)
		{
			$join_q = '';
		} 
		else
		{
			$i = 0;
			$join_q = '';
			foreach ($select['join'] as $joinkey => $value)
			{
				$join_q .= isset($value['type']) ? ' '.$value['type'].' ' : ' '.' JOIN ';
				$value['use_main'] = isset($value['use_main']) ? $value['use_main']  : false;
				if(!isset($value['prefix'])){
					$value['prefix'] = $joinkey;
				}
				$i++;
				$join_q.= '`'.$this->prefix.$value['table'].'` AS '.$value['prefix'].' ON '.$value['rule'];
				array_walk($value['fields'] , function(&$item, $index) use($value)
				{
					$item = $value['prefix'].'.'.$item.' AS '.($value['use_main'] == true ? '' : $value['prefix'].'_').$item;
				});
				$what .= ' , '.implode(',' , $value['fields']);
			}
		}
		$q = $this->query("SELECT ".$what." from `".$this->prefix.$table."` AS ".$select['alias']." ".$join_q." ".$where_q." ".$groupby_q." ".$sort_q." ".$limit_q);
		if ($func)
		{
			while($f = $this->fetch_assoc($q))
			{
				$func($f);
			}
		}
		return $q;
	}


	
	//Функция выбрать по ID
	function selectById($select, $func = false)
	{
		if(!isset($select['id']))
		{
			die('Не передан id');
		}
		else
		{
			$select['where'] = 'm.id='.intval($select['id']);
			return $this->select($select, $func);
		}
	}

	//Функция выбрать со страницами
	function selectWithPages(Array $select, $func = false, $advanced = false)
	{
		$result = array();
		$result['result'] = $this->select($select, $func);
		if ($advanced == false)
		{
			$select = $this->prepareSelect($select);
			$result['all_on_page'] = $this->num_rows;
			$result['all'] = $this->count(
				array(
					'table'=>$select['table'], 
					'where'=>$select['where'], 
					'join'=>$select['join'],
					'alias' => $select['alias'],
					'groupby'=>$select['groupby'],
				)
			);
		}
		else
		{
			$advanced($result);
		}
		return $result;
	}
	
	//Функция подсчета
	function count($select)
	{
		$select = $this->prepareSelect($select);
		$q = $this->select(array(
			'table' => $select['table'],
			'where' => $select['where'],
			'join' => $select['join'],
			'alias' => $select['alias'],
			'groupby' => $select['groupby'],
			'what' => 'count(DISTINCT m.id) as cnt'
		));
		return (int) $this->fetch_assoc($q)['cnt'];
	}
	
	//Забрать результат по ресурсу
	function result($q, $i, $f = false)
	{
		if ($q->num_rows == 0)
		{
			return false;
		}
		$q->data_seek($i);
		$res = $q->fetch_assoc(); 
		if ($f)
		{
			$res=$res[$f]; 
		}
		return $res; 
	}
		
	function fetch_assoc($result)
	{
		if ($result)
		{
			return mysqli_fetch_assoc($result);
		}
		else{
			return false;
		}
	}

	function close()
	{
		mysqli_close($this->mysqli);
	}

	function num_rows($query)
	{
		$res = $query->num_rows;
		return $res;
	}
	
	function escape($string)
	{
		return $this->mysqli->real_escape_string($string);
	}
	
	function insert_id()
	{
		return mysqli_insert_id($this->mysqli);
	}

}

?>