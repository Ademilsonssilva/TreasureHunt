document.write(`
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#nav1" aria-controls="nav1" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    
    
    <div class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="player_name_navbar_dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Player
        </a>
        <div class="dropdown-menu" aria-labelledby="player_name_navbar_dropdown">
            <a class="dropdown-item" href="#" onclick="logout();">Logout</a>
        </div>
    </div>
    

    <div class="collapse navbar-collapse" id="nav1">
        <a class="navbar-brand" href="#">Caça ao tesouro</a>
        <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
            <a class="nav-link" href="home.html">Home </a>
            </li>
        </ul>
        <!--<form class="form-inline my-2 my-lg-0">
            <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>-->
    </div>
</nav>
`);