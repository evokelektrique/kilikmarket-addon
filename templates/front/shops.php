<?php
// KilikMarketFunctions::iframe([
// 	'id' 		=> 'shops',
// 	'src' 		=> 'http://localhost/wordpress_projects/kilikmarket_proxy/index.php?url=http://amazon.com/', 
// 	'width' 	=> "100%", 
// 	"height" 	=> "600",
// ]);
?>


<div class="shopping_websites">
    <!-- ebay -->
    <span class="shopping_website_trigger" data-target="4"id="ebay_website"></span>

    <!-- aliexpress -->
    <span class="shopping_website_trigger" data-target="3"id="aliexpress_website"></span>

    <!-- sixpm -->
    <span class="shopping_website_trigger" data-target="2"id="sixpm_website"></span>

    <!-- amazonae -->
    <span class="shopping_website_trigger" data-target="1"id="amazonae_website"></span>

    <!-- amazon -->
    <span class="shopping_website_trigger" data-target="0"id="amazon_website"></span>
</div>

<!-- Iframe container -->
<div id="shopping_website_iframe">
    <div id="loading_iframe" style="display: none;">
        <style>
        #shopping_website_iframe {
            position: relative;
        }
        #km_iframe_spinner {
            position: absolute;
            height: 100%;
            width: 100%;
            background: #f9f9f9;
            place-items: center;
            top: 0;
            z-index: 99999999;
            right: 0;
            display: flex;
        }

        .sk-folding-cube {
          margin: 20px auto;
          width: 40px;
          height: 40px;
          position: relative;
          -webkit-transform: rotateZ(45deg);
                  transform: rotateZ(45deg);
        }

        .sk-folding-cube .sk-cube {
          float: left;
          width: 50%;
          height: 50%;
          position: relative;
          -webkit-transform: scale(1.1);
              -ms-transform: scale(1.1);
                  transform: scale(1.1); 
        }
        .sk-folding-cube .sk-cube:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #333;
          -webkit-animation: sk-foldCubeAngle 2.4s infinite linear both;
                  animation: sk-foldCubeAngle 2.4s infinite linear both;
          -webkit-transform-origin: 100% 100%;
              -ms-transform-origin: 100% 100%;
                  transform-origin: 100% 100%;
        }
        .sk-folding-cube .sk-cube2 {
          -webkit-transform: scale(1.1) rotateZ(90deg);
                  transform: scale(1.1) rotateZ(90deg);
        }
        .sk-folding-cube .sk-cube3 {
          -webkit-transform: scale(1.1) rotateZ(180deg);
                  transform: scale(1.1) rotateZ(180deg);
        }
        .sk-folding-cube .sk-cube4 {
          -webkit-transform: scale(1.1) rotateZ(270deg);
                  transform: scale(1.1) rotateZ(270deg);
        }
        .sk-folding-cube .sk-cube2:before {
          -webkit-animation-delay: 0.3s;
                  animation-delay: 0.3s;
        }
        .sk-folding-cube .sk-cube3:before {
          -webkit-animation-delay: 0.6s;
                  animation-delay: 0.6s; 
        }
        .sk-folding-cube .sk-cube4:before {
          -webkit-animation-delay: 0.9s;
                  animation-delay: 0.9s;
        }
        @-webkit-keyframes sk-foldCubeAngle {
          0%, 10% {
            -webkit-transform: perspective(140px) rotateX(-180deg);
                    transform: perspective(140px) rotateX(-180deg);
            opacity: 0; 
          } 25%, 75% {
            -webkit-transform: perspective(140px) rotateX(0deg);
                    transform: perspective(140px) rotateX(0deg);
            opacity: 1; 
          } 90%, 100% {
            -webkit-transform: perspective(140px) rotateY(180deg);
                    transform: perspective(140px) rotateY(180deg);
            opacity: 0; 
          } 
        }
        @keyframes sk-foldCubeAngle {
          0%, 10% {
            -webkit-transform: perspective(140px) rotateX(-180deg);
                    transform: perspective(140px) rotateX(-180deg);
            opacity: 0; 
          } 25%, 75% {
            -webkit-transform: perspective(140px) rotateX(0deg);
                    transform: perspective(140px) rotateX(0deg);
            opacity: 1; 
          } 90%, 100% {
            -webkit-transform: perspective(140px) rotateY(180deg);
                    transform: perspective(140px) rotateY(180deg);
            opacity: 0; 
          }
        }
        </style>
        <div id="km_iframe_spinner">
            <div class="sk-folding-cube">
              <div class="sk-cube1 sk-cube"></div>
              <div class="sk-cube2 sk-cube"></div>
              <div class="sk-cube4 sk-cube"></div>
              <div class="sk-cube3 sk-cube"></div>
            </div>
        </div>
    </div>
    <div id="iframe_container">
        
    </div>
</div>



<div id="external_add_to_cart_container" style="display: none">
	<button id="external_add_to_cart">Add To Cart</button>
	<button id="external_calculate">Calculate</button>
</div>
