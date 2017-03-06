const bot = require('./bot');
const RichEmbed = require('discord.js').RichEmbed;

exports.randomSelection = function () {
    return String(arguments[Math.floor(Math.random() * arguments.length)]);
};

exports.randomColor = function () {
    return [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
};

const randomFooter = function () {
    return exports.randomSelection(
        'just add water!',
        'Powered by squirrels!',
        'codeisluvcodeislife',
        'Where did you get that?',
        'WHAT DID YOU BREAK!?',
        'D-D-D-DROP THE BASS',
        'Eat, Sleep, Dubstep',
        '#BlameRayzr522'
    );
};

exports.embed = (title, description = '', fields = [], options = {}) => {
    let url = options.url || '';
    let color = options.color || this.randomColor();
    let footer = options.footer === undefined ? true : options.footer;

    if (fields.length > 0) fields.push({ name: '\u200b', value: '\u200b' });
    if (options.inline) {
        fields = fields.map(obj => { obj.inline = true; return obj; });
        if (fields.length % 3 === 2)
            fields.push({ name: '\u200b', value: '\u200b' });
    }
    if (url !== '') description += '\n';

    return new RichEmbed({ fields, video: options.video || url })
        .setTitle(title)
        .setColor(color)
        .setDescription(description)
        .setImage(options.image || url)
        .setTimestamp(options.timestamp ? new Date() : null)
        .setFooter(footer ? randomFooter() : '', footer ? bot.client.user.avatarURL : undefined);
};

exports.parseArgs = function (args, options) {
    if (!options)
        return args;
    if (typeof options === 'string')
        options = [options];

    var optionValues = {};
    var leftover = [];
    for (var i = 0; i < args.length; i++) {
        var arg = args[i];
        if (!arg.startsWith('-')) {
            leftover = leftover.concat(args.slice(i));
            break;
        }

        var label = arg.substr(1);

        if (options.indexOf(label + ':') > -1) {
            i++;
            optionValues[label] = args[i];
        } else if (options.indexOf(label) > -1) {
            optionValues[label] = true;
        } else {
            break;
        }
    }

    return {
        options: optionValues,
        leftover
    };
};

exports.multiSend = function (channel, messages, delay) {
    delay = delay || 100;
    messages.forEach((m, i) => {
        setTimeout(() => {
            channel.sendMessage(m);
        }, delay * i);
    });
};

exports.sendLarge = function (channel, largeMessage, options = {}) {
    var message = largeMessage;
    var messages = [];
    var prefix = options.prefix || '';
    var suffix = options.suffix || '';

    var max = 2000 - prefix.length - suffix.length;

    while (message.length >= max) {
        var part = message.substr(0, max);
        var cutTo = max;
        if (options.cutOn) {
            cutTo = part.lastIndexOf(options.cutOn);
            part = part.substr(0, cutTo);
        }
        messages.push(prefix + part + suffix);
        message = message.substr(cutTo);
    }

    if (message.length > 1) {
        messages.push(prefix + message + suffix);
    }

    this.multiSend(channel, messages, options.delay);
};
