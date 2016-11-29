angular.module('starter').controller('DocumentController', ['$scope','$rootScope','$ionicModal','$cordovaFile','$cordovaFileOpener2','$cordovaInAppBrowser', '$ionicLoading', 'InvoiceService', DocumentController]);

function DocumentController($scope, $rootScope, $ionicModal,$cordovaFile,$cordovaFileOpener2,$cordovaInAppBrowser,$ionicLoading, InvoiceService) {
  var vm = this;

  setDefaultsForPdfViewer($scope);
  $scope.show = function() {
    $ionicLoading.show().then(function(){
      console.log("The loading indicator is now displayed");
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide().then(function(){
      console.log("The loading indicator is now hidden");
    });
  };
  // Initialize the modal view.
  $ionicModal.fromTemplateUrl('pdf-viewer.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    vm.modal = modal;
  });


  vm.openExternalLink = function() {

var options = {
          location: 'yes',
          zoom: 'no'
       };
    $cordovaInAppBrowser.open('http://s2.corsan.rs.gov.br/', '_blank', options)
                   .then(function(event) {
                     // success
                   })
                   .catch(function(event) {
                     // error
                 });

    // var ref = $cordovaInAppBrowser.open('http://s2.corsan.rs.gov.br/', '_blank', 'location=yes, zoom=no, hidden=yes');
    // ref.addEventListener('loadstop', function() {
    //   ref.insertCSS({code : "body{padding:10px !important; display: block;} "});
    // });
  };

   $rootScope.$on('$cordovaInAppBrowser:loadstop', function(e, event){
      // insert CSS via code / file
      $cordovaInAppBrowser.insertCSS({
       code : 'body{padding:10px !important; display: block;}'
      });
   });
  vm.createInvoice = function (callback) {
    $scope.show();
    var invoice = getDummyData();
    callback = function(){
      $scope.hide();

      // <<<<<<< HEAD
      //window.open($scope.fileUrl, '_blank','location=no'); return false;
      $cordovaFileOpener2.open($scope.fileUrl,'application/pdf');
      // =======
      //       //window.open($scope.fileUrl, '_blank','location=yes'); return false;
      //       //window.open($scope.fileUrl, '_system'); return false;
      //       window.open($scope.fileUrl, '_self', 'location=yes' ); return false;
      //       //window.open('http://webpagetopdf.com/download/d8hiwd5h9zckmxzh/6iob92lg4g38btqe?rnd=0.3390894903811954', '_system'); return false;
      //
      // >>>>>>> 8b76ab14412d04ca57f0734f64145c64aa32f135

    }
    InvoiceService.createPdf(invoice)
    .then(function(pdf) {
      var blob = new Blob([pdf[0]], {type: 'application/pdf'});
      $scope.pdfUrl = URL.createObjectURL(blob);
      $scope.fileUrl = pdf[1]+"conta.pdf";
      console.log($scope.fileUrl);
      callback();
    });



  };
  // Clean up the modal view.
  $scope.$on('$destroy', function () {
    vm.modal.remove();
  });
  return vm;
}

function setDefaultsForPdfViewer($scope) {
  $scope.scroll = 0;
  $scope.loading = 'loading';

  $scope.onError = function (error) {
    console.error(error);
  };

  $scope.onLoad = function () {
    $scope.loading = '';
  };

  $scope.onProgress = function (progress) {
    console.log(progress);
  };
}

function getDummyData() {
  return {
    Date: new Date().toLocaleDateString("en-IE", { year: "numeric", month: "long", day: "numeric" }),
    AddressFrom: {
      Name: "Teste name",
      Address: "Endereço",
      Country: "País"
    },
    AddressTo: {
      Name: "Teste name",
      Address: "Endereço",
      Country: "País"
    },
    Items: [
      { Description: 'iPhone 6S', Quantity: '1', Price: '€700' },
      { Description: 'Samsung Galaxy S6', Quantity: '2', Price: '€655' }
    ],
    Subtotal: '€2010',
    Shipping: '€6',
    Total: '€2016'
  };
}
