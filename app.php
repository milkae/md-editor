<?php
session_start();
if(isset($_POST['data'])) {
	$_SESSION['storedTexts'] = $_POST['data'];
}
if(isset($_SESSION['storedTexts'])) {
	header('Content-Type: application/json');
	echo json_encode($_SESSION['storedTexts']);
}
?>