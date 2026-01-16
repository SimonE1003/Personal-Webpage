document.addEventListener('DOMContentLoaded', () => {
    function typeWriter(text, element, speed) {
        let i = 0;
        element.innerHTML = "";

        function typing() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typing, speed);
            }
        }
        typing();
    }

  const greetingElement = document.getElementById('greeting');
  typeWriter("Hi, I'm Simon Wang.", greetingElement, 80);
});
