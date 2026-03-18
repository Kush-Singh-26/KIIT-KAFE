<?php include 'includes/head.php'; ?>
<body>
    <div class="item-tooltip" id="tooltip"></div>
    <canvas id="canvas3d"></canvas>
    <?php 
      // Basic Routing for PHP to pass initial page to JS
      $request = $_SERVER['REQUEST_URI'];
      $base = $basePath; // Using the dynamic path defined in head.php
      $path = str_replace($base, '', $request);
      $path = strtok($path, '?'); // Strip query params
      $path = trim($path, '/');
      
      // Map empty or "index.php" to "landing"
      if (empty($path) || $path === 'index.php') $path = 'landing';
      
      echo "<script>
        window.basePath = '$basePath';
        window.initialPage = '$path';
      </script>";

      include 'includes/landing.php';
      include 'includes/auth.php';
      include 'includes/menu.php';
      include 'includes/cart.php';
      include 'includes/payment.php';
      include 'includes/success.php';
      include 'includes/admin.php';
      include 'includes/modals.php';
      include 'includes/scripts.php';
    ?>
</body>
</html>